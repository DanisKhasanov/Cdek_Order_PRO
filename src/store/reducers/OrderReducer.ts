import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PackageItem {
  id: string;
  name: string;
  ware_key: string;
  weight: number;
  amount: number;
  payment: {
    value: number;
  };
  cost: number;
}

interface Package {
  number: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  items: PackageItem[];
}

interface Positions {
  quantity: number;
  price: number;
  vat: number;
  name: string;
  code: string;
  weight: number;
}

interface OrderFormState {
  number: string;
  sender: {
    phones: [{ number: string }];
  };
  recipient: {
    name: string;
    phones: [{ number: string }];
  };
  fromLocation: {
    code: number;
    city: string;
    postalCode: string;
    address: string;
  };
  toLocation: {
    code: number;
    city: string;
    postalCode: string;
    address: string;
  };
  packages: Package[];
  comment: string;
  commentDelivery: string;
  deliveryPoint: string;
  deliveryPointAddress: any;
  tariffCode: number;
  services: { code: string; parameter: string }[] | [];
  cod: boolean;
  sum: number;
  deliveryRecipientCost: {
    value: number;
  };
  orderCreated: boolean;
  counterParty: boolean;
  positions: Positions[];
  weight: number;
}

const initialState: OrderFormState = {
  number: "",
  sender: {
    phones: [{ number: "" }],
  },
  recipient: {
    name: "",
    phones: [{ number: "" }],
  },
  fromLocation: {
    code: 0,
    city: "",
    postalCode: "",
    address: "",
  },
  toLocation: {
    code: 0,
    city: "",
    postalCode: "",
    address: "",
  },
  packages: [],
  comment: "",
  commentDelivery: "",
  deliveryPoint: "",
  deliveryPointAddress: {},
  tariffCode: 0,
  services: [],
  cod: false,
  sum: 0,
  deliveryRecipientCost: {
    value: 0,
  },
  orderCreated: false,
  counterParty: true,
  positions: [],
  weight: 0,
};

const orderFormSlice = createSlice({
  name: "orderForm",
  initialState,
  reducers: {
    updateOrderForm: (
      state,
      action: PayloadAction<Partial<OrderFormState>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    setRecipientName: (state, action: PayloadAction<string>) => {
      state.recipient.name = action.payload;
    },

    setRecipientPhone: (state, action: PayloadAction<string>) => {
      state.recipient.phones[0].number = action.payload;
    },

    setRecipientAddress: (
      state,
      action: PayloadAction<{
        address: string;
        postal_code: string;
        city: string;
      }>
    ) => {
      state.toLocation.address = action.payload.address;
      state.toLocation.postalCode = action.payload.postal_code;
      state.toLocation.city = action.payload.city;
    },

    addCargoSpace: (state, action: PayloadAction<Package[]>) => {
      action.payload.forEach((pkg: any) => {
        state.packages.push({
          number: pkg.number,
          weight: pkg.weight,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          items: pkg.items.map((item: any) => ({
            id: `${pkg.number}_${item.ware_key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Уникальный ID
            name: item.name,
            ware_key: item.ware_key,
            weight: item.weight,
            amount: item.amount,
            payment: {
              value: state.cod ? item.payment.value : 0,
            },
            cost: item.cost,
          })),
        });
      });
    },

    editCargoSpace: (
      state,
      action: PayloadAction<{
        index: number;
        size: string;
      }>
    ) => {
      const { index, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);

      state.packages[index] = {
        ...state.packages[index],
        length: length,
        width: width,
        height: height,
      };
    },

    removeCargoSpace: (state, action: PayloadAction<number>) => {
      const removedIndex = action.payload;
    
      if (state.packages.length === 1) {
        state.packages = [];
        state.weight = 0;
        return;
      }
    
      const removedPackage = state.packages[removedIndex];
      const targetIndex = removedIndex === 0 ? 1 : removedIndex - 1;
      const targetPackage = state.packages[targetIndex];
    
      // Создаем временный объект для объединения товаров по ware_key
      const mergedItems: Record<string, PackageItem> = {};
    
      // Сначала добавляем все товары из целевого ГМ
      targetPackage.items.forEach(item => {
        mergedItems[item.ware_key] = {
          ...item,
          id: `${targetPackage.number}_${item.ware_key}_${Date.now()}` // Новый ID
        };
      });
    
      // Затем добавляем/объединяем товары из удаляемого ГМ
      removedPackage.items.forEach(item => {
        if (mergedItems[item.ware_key]) {
          // Если товар уже есть - увеличиваем количество
          mergedItems[item.ware_key] = {
            ...mergedItems[item.ware_key],
            amount: mergedItems[item.ware_key].amount + item.amount
          };
        } else {
          // Если товара нет - добавляем новый
          mergedItems[item.ware_key] = {
            ...item,
            id: `${targetPackage.number}_${item.ware_key}_${Date.now()}` // Новый ID
          };
        }
      });
    
      // Обновляем целевой ГМ
      state.packages[targetIndex] = {
        ...targetPackage,
        items: Object.values(mergedItems),
        weight: Object.values(mergedItems).reduce(
          (total, item) => total + item.weight * item.amount,
          0
        )
      };
    
      // Удаляем ГМ
      state.packages = state.packages.filter((_, index) => index !== removedIndex);
    
      // Пересчитываем общий вес
      state.weight = state.packages.reduce(
        (total, pkg) => total + pkg.weight,
        0
      );
    },

    updateCargoSpaces: (
      state,
      action: PayloadAction<{
        fromPackage: Package;
        toPackage: Package;
        movedItemId: string; 
        quantity: number;
      }>
    ) => {
      const { fromPackage, toPackage, movedItemId, quantity } = action.payload;

      const recalculateWeight = (pkg: Package) => ({
        ...pkg,
        weight: pkg.items.reduce(
          (total, item) => total + item.weight * item.amount,
          0
        ),
      });

      // Находим и обрабатываем исходный товар
      const fromItems = fromPackage.items.map(item => {
        if (item.id === movedItemId) {
          return {
            ...item,
            amount: item.amount - quantity
          };
        }
        return item;
      }).filter(item => item.amount > 0);

      // Находим оригинальный товар для копирования данных
      const originalItem = fromPackage.items.find(item => item.id === movedItemId);
      if (!originalItem) return;

      // Создаем новую копию товара с новым уникальным ID
      const newItem = {
        ...originalItem,
        id: `${toPackage.number}_${originalItem.ware_key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: quantity
      };

      // Добавляем в целевое место
      const toItems = [...toPackage.items];
      const existingItemIndex = toItems.findIndex(
        it => it.ware_key === originalItem.ware_key
      );

      if (existingItemIndex >= 0) {
        toItems[existingItemIndex] = {
          ...toItems[existingItemIndex],
          amount: toItems[existingItemIndex].amount + quantity
        };
      } else {
        toItems.push(newItem);
      }

      const updatedFromPackage = recalculateWeight({
        ...fromPackage,
        items: fromItems
      });

      const updatedToPackage = recalculateWeight({
        ...toPackage,
        items: toItems
      });

      state.packages = state.packages.map(pkg =>
        pkg.number === updatedFromPackage.number ? updatedFromPackage : pkg
      );

      state.packages = state.packages.map(pkg =>
        pkg.number === updatedToPackage.number ? updatedToPackage : pkg
      );
    },

    updateServices: (
      state,
      action: PayloadAction<{ code: string; parameter: string } | null>
    ) => {
      if (action.payload === null) {
        state.services = [];
      } else {
        const { code, parameter } = action.payload;
        state.services = [{ code, parameter }];
      }
    },
    
    resetOrderForm: (state) => {
      state.number = "";
      state.sender = {
        phones: [{ number: "" }],
      };
      state.recipient = {
        name: "",
        phones: [{ number: "" }],
      };
      state.fromLocation = {
        code: 0,
        city: "",
        postalCode: "",
        address: "",
      };
      state.toLocation = {
        code: 0,
        city: "",
        postalCode: "",
        address: "",
      };
      state.packages = [];
      state.comment = "";
      state.commentDelivery = "";
      state.deliveryPoint = "";
      state.deliveryPointAddress = {};
      state.tariffCode = 0;
      state.services = [];
      state.cod = false;
      state.sum = 0;
      state.deliveryRecipientCost = {
        value: 0,
      };
      state.orderCreated = false;
      state.counterParty = true;
      state.positions = [];
      state.weight = 0;
    },

  },
});

export const {
  updateOrderForm,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
  addCargoSpace,
  editCargoSpace,
  resetOrderForm,
  updateCargoSpaces,
  removeCargoSpace,
  updateServices,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
