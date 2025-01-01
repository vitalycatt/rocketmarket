"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

type Language = 'en' | 'ru';

type TranslationParams = Record<string, string | number>;

type TranslationValue = string | ((count: number) => string) | {
  [key: string]: TranslationValue;
};

type Translations = {
  [key in Language]: {
    [key: string]: TranslationValue;
  };
};

const translations: Translations = {
  en: {
    home: "Home",
    orders: "Orders",
    profile: "Profile",
    search: "Search products...",
    location: "Location",
    cart: "Cart",
    featuredStories: "Featured Stories",
    products: "Products",
    popular: "Popular",
    newArrivals: "New Arrivals",
    onSale: "On Sale",
    addToCart: "Add to Cart",
    loading: "Loading more products...",
    freshAndDelicious: "Fresh and Delicious",
    discoverFlavors: "Discover new flavors every day",
    shopNow: "Shop Now",
    aboutUs: "About Us",
    customerService: "Customer Service",
    legal: "Legal",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved",
    back: "Back",
    "Healthy Breakfast": "Healthy Breakfast",
    "Quick Lunch Ideas": "Quick Lunch Ideas",
    "Gourmet Dinner": "Gourmet Dinner",
    "Vegan Recipes": "Vegan Recipes",
    "Seasonal Fruits": "Seasonal Fruits",
    "Fresh Seafood": "Fresh Seafood",
    "Healthy Snacks": "Healthy Snacks",
    "Refreshing Drinks": "Refreshing Drinks",
    toggleMenu: "Toggle menu",
    categories: "Categories",
    chooseCategoryDescription: 'Browse through our product categories',
    mobileMenu: "Mobile Menu",
    viewAll: "View All",
    popularProducts: "Popular Products",
    loadMore: "Load More",
    backToCategories: "Back to Categories",
    "All Products": "All Products",
    "Breakfast": "Breakfast",
    "Cereals": "Cereals",
    "Hot Cereals": "Hot Cereals",
    "Cold Cereals": "Cold Cereals",
    "Pancakes & Waffles": "Pancakes & Waffles",
    "Breakfast Pastries": "Breakfast Pastries",
    "Fruits & Vegetables": "Fruits & Vegetables",
    "Fresh Fruits": "Fresh Fruits",
    "Fresh Vegetables": "Fresh Vegetables",
    "Dairy & Eggs": "Dairy & Eggs",
    "Milk": "Milk",
    "Cheese": "Cheese",
    "Eggs": "Eggs",
    "Yogurt": "Yogurt",
    "Butter": "Butter",
    "Oatmeal": "Oatmeal",
    "Instant Oatmeal": "Instant Oatmeal",
    "Steel Cut Oats": "Steel Cut Oats",
    "Cream of Wheat": "Cream of Wheat",
    "Grits": "Grits",
    "Granola": "Granola",
    "Muesli": "Muesli",
    "Corn Flakes": "Corn Flakes",
    "Bran Cereals": "Bran Cereals",
    "Pancake Mix": "Pancake Mix",
    "Waffle Mix": "Waffle Mix",
    "Syrups": "Syrups",
    "Muffins": "Muffins",
    "Croissants": "Croissants",
    "Donuts": "Donuts",
    "Danish": "Danish",
    "Apples": "Apples",
    "Bananas": "Bananas",
    "Berries": "Berries",
    "Citrus": "Citrus",
    "Tropical Fruits": "Tropical Fruits",
    "Leafy Greens": "Leafy Greens",
    "Root Vegetables": "Root Vegetables",
    "Cruciferous Vegetables": "Cruciferous Vegetables",
    "Alliums": "Alliums",
    "Squashes": "Squashes",
    "Peppers": "Peppers",
    "Whole Milk": "Whole Milk",
    "Low-Fat Milk": "Low-Fat Milk",
    "Skim Milk": "Skim Milk",
    "Plant-Based Milk": "Plant-Based Milk",
    "Hard Cheese": "Hard Cheese",
    "Soft Cheese": "Soft Cheese",
    "Blue Cheese": "Blue Cheese",
    "Processed Cheese": "Processed Cheese",
    total: "Total",
    checkout: "Checkout",
    clearCart: "Clear Cart",
    cartEmpty: "Your cart is empty",
    addItemsToCart: "Add some products to your cart",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    checkoutNotImplemented: "Checkout is not implemented yet",
    close: "Close",
    ourStory: "Our Story",
    blog: "Blog",
    careers: "Careers",
    help: "Help",
    returns: "Returns",
    contactUs: "Contact Us",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    sortBy: "Sort by",
    inCart: "In Cart",
    profileInfo: "Profile Information",
    editProfile: "Edit Profile",
    account: "Account",
    notifications: "Notifications",
    accountSettings: "Account Settings",
    manageYourAccountSettings: "Manage your account settings and preferences.",
    name: "Name",
    email: "Email",
    receiveMarketingEmails: "Receive marketing emails",
    saveChanges: "Save Changes",
    notificationPreferences: "Notification Preferences",
    manageYourNotificationSettings: "Manage your notification settings.",
    orderUpdates: "Order Updates",
    newProducts: "New Products",
    specialOffers: "Special Offers",
    savePreferences: "Save Preferences",
    recentOrders: "Recent Orders",
    viewYourRecentOrders: "View your recent orders and their status.",
    processed: "Processed",
    viewDetails: "View Details",
    viewAllOrders: "View All Orders",
    paymentMethods: "Payment Methods",
    notificationSettings: "Notification Settings",
    logout: "Log Out",
    language: "Language",
    english: "English",
    russian: "Russian",
    receiveMarketingEmailsDescription: "Receive emails about new products, offers, and updates",
    explore: "Explore",
    receiveUpdatesOnYourOrders: "Receive updates on your orders",
    beNotifiedAboutNewProducts: "Be notified about new products",
    receiveSpecialOffersAndDiscounts: "Receive special offers and discounts",
    items: (count: number) => count === 1 ? "item" : "items",
    menu: "Menu",
    contracts: "Contracts",
    fullName: "Full Name",
    address: "Address",
    city: "City",
    country: "Country",
    postalCode: "Postal Code",
    continueToPayment: "Continue to Payment",
    continueToReview: "Continue to Review",
    creditCard: "Bank Card",
    shippingAddress: "Shipping Address",
    paymentMethod: "Payment Method",
    orderItems: "Order Items",
    placeOrder: "Place Order",
    firstName: "First Name",
    lastName: "Last Name",
    deliverTo: "Deliver to",
    change: "Change",
    estimatedDelivery: "Estimated Delivery",
    deliveryEstimate: "3-5 business days",
    processing: "Processing...",
    orderConfirmed: "Order Confirmed",
    orderConfirmationMessage: "Thank you for your order. We'll send you a confirmation email shortly.",
    contractNumber: "Contract Number",
    legalEntity: "Legal Entity",
    startDate: "Start Date",
    endDate: "End Date",
    actions: "Actions",
    edit: "Edit",
    editContract: "Edit Contract",
    contractDetails: "Contract details for contract number {number}",
    terminateContract: "Terminate Contract",
    viewYourContracts: "View and manage your contracts",
    signedOn: "Signed on",
    viewContract: "View Contract",
    viewAllContracts: "View All Contracts",
    payByContract: "Pay by Contract",
    selectContract: "Select Contract",
    selectContractPlaceholder: "Choose a contract",
    shippingInformation: "Shipping Information",
    orderSummary: "Order Summary",
    phone: "Phone",
    heroSubtitle: "Explore our wide range of fresh and delicious products",
    premiumMember: "Premium Member",
    since: "Since",
    phoneNumber: "Phone Number",
    selectLanguage: "Select Language",
    marketingEmailsDescription: "Receive emails about new products, offers, and updates",
    requestNewContract: "Request New Contract",
    fillNewContractDetails: "Please fill in the details for your new contract request",
    companyName: "Company Name",
    contactPerson: "Contact Person",
    businessEmail: "Business Email",
    submitRequest: "Submit Request",
    contract: "Contract",
    deliveryMethod: "Delivery Method",
    courier: "Courier",
    pickup: "Pickup",
    addEditAddress: "Add/Edit Address",
    findMe: "Find Me",
    fullAddress: "Full Address",
    selectHouseOnMap: "Select House on Map",
    entrance: "Entrance",
    apartment: "Apartment",
    intercom: "Intercom",
    comment: "Comment",
    addAddress: "Add Address",
    productDetails: "Product details: {productName}",
    personalInformation: "Personal Information",
    managePersonalInfo: "Manage your personal information",
    company: "Company",
    save: "Save",
    receiveUpdates: "Receive Updates",
    activeContracts: "Active Contracts",
    productDrawer: "Product Drawer",
    weight: "Weight",
    off: "Off",
    decreaseQuantity: "Decrease Quantity",
    increaseQuantity: "Increase Quantity",
    pickupAddress: "Pickup Address",
    addressDrawerTitle: "Delivery Address",
    addressDrawerDescription: "Enter your delivery address or select it on the map",
    useCurrentLocation: "Use current location",
    determiningLocation: "Determining your location...",
    currentLocation: "My current location",
    addressLabel: "Address",
    addressPlaceholder: "For example: 123 Main St",
    addressHelper: "Enter street and house number or select on map",
    apartmentDetailsLabel: "Apartment/office, floor, entrance",
    apartmentDetailsPlaceholder: "For example: apt. 5, floor 3, entrance 1",
    apartmentDetailsHelper: "Add details for courier",
    saveAddress: "Save address",
    saveAddressAria: "Save address",
    toggleMapSize: "Toggle map size",
    closeAddressDrawer: "Close address drawer",
    noSavedAddresses: "You have no saved addresses.",
    catalog: 'Catalog',
    searchProducts: 'Search products',
    openCatalog: 'Open Catalog',
    browseAllProducts: 'Browse all products',
    productsCount: (count: number) => count === 1 ? 'product' : 'products',
    enterAddress: 'Enter address',
    addressNotSpecified: 'Address not specified',
    exploreCategory: "Explore category",
    heroDescription: "We offer a wide range of high-quality products at wholesale prices. Fresh products, fast delivery, and reliable service for your business.",
    wholesaleSupplies: "Wholesale Supplies",
    food: "Food Products",
    householdGoods: "Household Goods",
    toys: "Toys",
    groceries: "Groceries",
    cannedGoods: "Canned Goods",
    beverages: "Beverages",
    allCategories: "All Categories",
    price: "Price",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    newest: "Newest",
    rating: "Rating",
    brand: "Brand",
    volume: "Volume",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    description: "Description",
    specifications: "Specifications",
    relatedProducts: "Related Products",
    addedToCart: "Added to Cart",
    removedFromCart: "Removed from Cart",
    emptyCart: "Your cart is empty",
    emptyCartDescription: "Add some products to your cart and they will appear here",
    geolocationNotSupported: "Geolocation is not supported by your browser",
    geolocationError: "Error getting location",
    geolocationPermissionDenied: "Permission to access location was denied",
    geolocationUnavailable: "Location information is unavailable",
    geolocationTimeout: "Request to get location timed out",
    allowGeolocation: "Allow location access",
    allowGeolocationDescription: "This will help us show you nearby stores and delivery options",
    allow: "Allow",
    viewOrder: "View Order",
    newContract: "New Contract",
    createNewContract: "Create New Contract",
    enterCompanyName: "Enter company name",
    companyCreated: "Company successfully created",
    failedToCreateCompany: "Failed to create company",
    // Auth related
    login: "Login",
    enterPhoneNumber: "Enter phone number",
    enterSmsCode: "Enter SMS code",
    phoneVerification: "Phone Verification",
    sendCode: "Send Code",
    verifyCode: "Verify Code",
    invalidPhoneNumber: "Invalid phone number",
    invalidCode: "Invalid code",
    unknownError: "An error occurred. Please try again",
    sending: "Sending...",
    verifying: "Verifying...",
    resendCodeIn: "Resend code in {{seconds}} seconds",
    // Profile menu
    settings: "Settings",
    personalInfo: "Personal Information",
    profileName: "Name",
    profileEmail: "Email",
    profilePhone: "Phone",
    dateOfBirth: "Birthday",
    cancel: "Cancel",
    saveProfile: "Save",
    guest: "Guest",
    // Profile translations
    profileSettings: "Profile Settings",
    updateProfile: "Update Profile",
    profileUpdated: "Profile updated successfully",
    profileUpdateError: "Failed to update profile",
    loadingProfile: "Loading profile...",
    updating: "Updating...",
    // Contracts translations
    created: "Created",
    updated: "Updated",
    noContracts: "No contracts found",
    loadingContracts: "Loading contracts...",
    failedToLoadContracts: "Failed to load contracts",
    unknown: "Unknown",
    status_pending: "Pending",
    status_active: "Active",
    status_inactive: "Inactive",
    status_dissolution: "Dissolution",
    status_dissolved: "Dissolved",
    cartpg: {
      title: "Cart",
      empty: "Cart is empty",
      addItems: "Add items to cart",
      continueShopping: "Continue Shopping",
      total: "Total",
      clear: "Clear Cart",
      checkout: "Checkout",
      quantity: "Quantity",
      processing: "Processing...",
      remove: "Remove from cart",
      itemAdded: "Item added to cart",
      itemRemoved: "Item removed from cart",
      cartCleared: "Cart cleared",
      promoCode: "Promo Code",
      applyPromoCode: "Apply",
      enterPromoCode: "Enter promo code",
      promoCodeApplied: "Promo code applied",
      promoCodeInvalid: "Invalid promo code",
      promoCodeDiscount: "Discount",
      removePromoCode: "Remove",
    },
    checkoutpg: {
      title: "Checkout",
      orderInfo: "Order Information",
      recipientName: "Recipient Name",
      enterRecipientName: "Enter recipient name",
      orderComment: "Order Comment",
      enterOrderComment: "Enter any additional information about your order",
      deliveryAddress: "Delivery Address",
      noAddressSelected: "No address selected",
      selectAddress: "Select Address",
      changeAddress: "Change Address",
      paymentMethod: "Payment Method",
      creditCard: "Credit Card",
      cash: "Cash Payment",
      deliveryMethod: "Delivery Method",
      courier: "Courier Delivery",
      pickup: "Pickup from Store",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      total: "Total Amount",
      deliveryCost: "Delivery Cost",
      freeDelivery: "Free Delivery",
      deliveryFrom: "from",
      placeOrder: "Place Order",
      processing: "Processing Order...",
      fillAllFields: "Please fill in all required fields",
      success: {
        title: "Order Placed Successfully",
        message: "Thank you for your order! We will contact you shortly.",
        orderNumber: "Order Number",
        backToHome: "Back to Home"
      },
      promoCode: "Promo Code",
      applyPromoCode: "Apply",
      enterPromoCode: "Enter promo code",
      promoCodeApplied: "Promo code applied",
      promoCodeInvalid: "Invalid promo code",
      promoCodeDiscount: "Discount",
      removePromoCode: "Remove",
    },
    noProductsFound: "No products found",
  },
  ru: {
    home: "Главная",
    orders: "Заказы",
    profile: "Профиль",
    search: "Поиск товаров...",
    location: "Местоположение",
    cart: "Корзина",
    featuredStories: "Популярные истории",
    products: "Товары",
    popular: "Популярное",
    newArrivals: "Новинки",
    onSale: "Распродажа",
    addToCart: "В корзину",
    loading: "Загрузка товаров...",
    freshAndDelicious: "Свежее и вкусное",
    discoverFlavors: "Откройте для себя новые вкусы каждый день",
    shopNow: "Купить сейчас",
    aboutUs: "О нас",
    customerService: "Служба поддержки",
    legal: "Правовая информация",
    followUs: "Подписывайтесь на нас",
    allRightsReserved: "Все права защищены",
    back: "Назад",
    "Healthy Breakfast": "Здоровый завтрак",
    "Quick Lunch Ideas": "Идеи быстрого обеда",
    "Gourmet Dinner": "Изысканный ужин",
    "Vegan Recipes": "Веганские рецепты",
    "Seasonal Fruits": "Сезонные фрукты",
    "Fresh Seafood": "Свежие морепродукты",
    "Healthy Snacks": "Полезные закуски",
    "Refreshing Drinks": "Освежающие напитки",
    toggleMenu: "Открыть/закрыть меню",
    categories: "Категории",
    chooseCategoryDescription: 'Выберите интересующую вас категорию',
    mobileMenu: "Мобильное меню",
    viewAll: "Смотреть все",
    popularProducts: "Популярные товары",
    loadMore: "Загрузить ещё",
    backToCategories: "Назад к категориям",
    "All Products": "Все продукты",
    "Breakfast": "Завтрак",
    "Cereals": "Хлопья",
    "Hot Cereals": "Горячие хлопья",
    "Cold Cereals": "Холодные хлопья",
    "Pancakes & Waffles": "Блины и вафли",
    "Breakfast Pastries": "Выпечка к завтраку",
    "Fruits & Vegetables": "Фрукты и овощи",
    "Fresh Fruits": "Свежие фрукты",
    "Fresh Vegetables": "Свежие овощи",
    "Dairy & Eggs": "Молочные продукты и яйца",
    "Milk": "Молоко",
    "Cheese": "Сыр",
    "Eggs": "Яйца",
    "Yogurt": "Йогурт",
    "Butter": "Масло",
    "Oatmeal": "Овсянка",
    "Instant Oatmeal": "Быстрая овсянка",
    "Steel Cut Oats": "Овсянка грубого помола",
    "Cream of Wheat": "Манная каша",
    "Grits": "Кукурузная каша",
    "Granola": "Гранола",
    "Muesli": "Мюсли",
    "Corn Flakes": "Кукурузные хлопья",
    "Bran Cereals": "Отрубные хлопья",
    "Pancake Mix": "Смесь для блинов",
    "Waffle Mix": "Смесь для вафель",
    "Syrups": "Сиропы",
    "Muffins": "Маффины",
    "Croissants": "Круассаны",
    "Donuts": "Пончики",
    "Danish": "Датская выпечка",
    "Apples": "Яблоки",
    "Bananas": "Бананы",
    "Berries": "Ягоды",
    "Citrus": "Цитрусовые",
    "Tropical Fruits": "Тропические фрукты",
    "Leafy Greens": "Листовые овощи",
    "Root Vegetables": "Корнеплоды",
    "Cruciferous Vegetables": "Крестоцветные овощи",
    "Alliums": "Луковые",
    "Squashes": "Тыквенные",
    "Peppers": "Перцы",
    "Whole Milk": "Цельное молоко",
    "Low-Fat Milk": "Маложирное молоко",
    "Skim Milk": "Обезжиренное молоко",
    "Plant-Based Milk": "Растительное молоко",
    "Hard Cheese": "Твердый сыр",
    "Soft Cheese": "Мягкий сыр",
    "Blue Cheese": "Голубой сыр",
    "Processed Cheese": "Плавленый сыр",
    total: "Итого",
    checkout: "Оформить заказ",
    clearCart: "Очистить корзину",
    cartEmpty: "Ваша корзина пуста",
    addItemsToCart: "Добавьте товары в корзину",
    continueShopping: "Продолжить покупки",
    subtotal: "Подытог",
    checkoutNotImplemented: "Оформление заказа еще не реализовано",
    close: "Закрыть",
    ourStory: "Наша история",
    blog: "Блог",
    careers: "Карьера",
    help: "Помощь",
    returns: "Возвраты",
    contactUs: "Связаться с нами",
    termsOfService: "Условия использования",
    privacyPolicy: "Политика конфиденциальности",
    cookiePolicy: "Политика использования файлов cookie",
    sortBy: "Сортировать по",
    inCart: "В корзине",
    profileInfo: "Информация профиля",
    editProfile: "Редактировать профиль",
    account: "Аккаунт",
    notifications: "Уведомления",
    accountSettings: "Настройки аккаунта",
    manageYourAccountSettings: "Управляйте настройками и предпочтениями вашего аккаунта.",
    name: "Имя",
    email: "Электронная почта",
    receiveMarketingEmails: "Получать маркетинговые письма",
    saveChanges: "Сохранить изменения",
    notificationPreferences: "Настройки уведомлений",
    manageYourNotificationSettings: "Управляйте настройками уведомлений.",
    orderUpdates: "Обновления заказов",
    newProducts: "Новые продукты",
    specialOffers: "Специальные предложения",
    savePreferences: "Сохранить настройки",
    recentOrders: "Последние заказы",
    viewYourRecentOrders: "Просмотрите ваши недавние заказы и их статус.",
    processed: "Обработан",
    viewDetails: "Посмотреть детали",
    viewAllOrders: "Посмотреть все заказы",
    paymentMethods: "Способы оплаты",
    notificationSettings: "Настройки уведомлений",
    logout: "Выйти",
    language: "Язык",
    english: "Английский",
    russian: "Русский",
    receiveMarketingEmailsDescription: "Получайте письма о новых продуктах, предложениях и обновлениях",
    explore: "Исследовать",
    receiveUpdatesOnYourOrders: "Получайте обновления о ваших заказах",
    beNotifiedAboutNewProducts: "Получайте уведомления о новых продуктах",
    receiveSpecialOffersAndDiscounts: "Получайте специальные предложения и скидки",
    items: (count: number) => {
      if (count % 10 === 1 && count % 100 !== 11) {
        return "товар";
      } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return "товара";
      } else {
        return "товаров";
      }
    },
    menu: "Меню",
    contracts: "Договоры",
    fullName: "Полное имя",
    address: "Адрес",
    city: "Город",
    country: "Страна",
    postalCode: "Почтовый индекс",
    continueToPayment: "Перейти к оплате",
    continueToReview: "Перейти к проверке",
    creditCard: "Банковской карта",
    shippingAddress: "Адрес доставки",
    paymentMethod: "Способ оплаты",
    orderItems: "Товары в заказе",
    placeOrder: "Разместить заказ",
    firstName: "Имя",
    lastName: "Фамилия",
    deliverTo: "Доставить по адресу",
    change: "Изменить",
    estimatedDelivery: "Ожидаемая доставка",
    deliveryEstimate: "3-5 рабочих дней",
    processing: "Обработка...",
    orderConfirmed: "Заказ подтвержден",
    orderConfirmationMessage: "Ваш заказ подтвержден!",
    contractNumber: "Номер договора",
    legalEntity: "Юридическое лицо",
    startDate: "Дата начала",
    endDate: "Дата окончания",
    actions: "Действия",
    edit: "Редактировать",
    editContract: "Редактировать договор",
    contractDetails: "Детали договора номер {number}",
    terminateContract: "Расторгнуть",
    viewYourContracts: "Просмотр и управление вашими договорами",
    signedOn: "Подписан",
    viewContract: "Просмотреть договор",
    viewAllContracts: "Просмотреть все договоры",
    payByContract: "Оплата по договору",
    selectContract: "Выберите договор",
    selectContractPlaceholder: "Выберите договор",
    shippingInformation: "Информация о доставке",
    orderSummary: "Сводка заказа",
    phone: "Телефон",
    heroSubtitle: "Исследуйте наш широкий ассортимент свежих и вкусных продуктов",
    premiumMember: "Премиум-участник",
    since: "С",
    phoneNumber: "Номер телефона",
    selectLanguage: "Выберите язык",
    marketingEmailsDescription: "Получайте письма о новых продуктах, предложениях и обновлениях",
    requestNewContract: "Запросить новый договор",
    fillNewContractDetails: "Пожалуйста, заполните детали для запроса нового договора",
    companyName: "Название компании",
    contactPerson: "Контактное лицо",
    businessEmail: "Корпоративная электронная почта",
    submitRequest: "Отправить запрос",
    contract: "Договор",
    deliveryMethod: "Способ доставки",
    courier: "Курьером",
    pickup: "Самовывоз",
    addEditAddress: "Добавить/Изменить адрес",
    findMe: "Найти меня",
    fullAddress: "Полный адрес",
    selectHouseOnMap: "Выбрать дом на карте",
    entrance: "Подъезд",
    apartment: "Квартира",
    intercom: "Домофон",
    comment: "Комментарий",
    addAddress: "Добавить адрес",
    productDetails: "Детали продукта",
    personalInformation: "Личная информация",
    managePersonalInfo: "Управляйте своей личной информацией",
    company: "Компания",
    save: "Сохранить",
    receiveUpdates: "Получать обновления",
    activeContracts: "Активные контракты",
    productDrawer: "Выдвижной ящик продукта",
    weight: "Вес",
    off: "Скидка",
    decreaseQuantity: "Уменьшить количество",
    increaseQuantity: "Увеличить количество",
    pickupAddress: "Адрес самовывоза",
    addressDrawerTitle: "Адрес доставки",
    addressDrawerDescription: "Введите адрес доставки или выберите его на карте",
    useCurrentLocation: "Использовать текущее местоположение",
    determiningLocation: "Определяем ваше местоположение...",
    currentLocation: "Мое текущее местоположение",
    addressLabel: "Адрес",
    addressPlaceholder: "Например: ул. Ленина, 10",
    addressHelper: "Введите улицу и номер дома или выберите на карте",
    apartmentDetailsLabel: "Квартира/офис, этаж, подъезд",
    apartmentDetailsPlaceholder: "Например: кв. 5, этаж 3, подъезд 1",
    apartmentDetailsHelper: "Добавьте детали для курьера",
    saveAddress: "Сохранить адрес",
    saveAddressAria: "Сохранить адрес",
    toggleMapSize: "Изменить размер карты",
    closeAddressDrawer: "Закрыть панель адреса",
    noSavedAddresses: "У вас нет сохраненных адресов.",
    catalog: 'Каталог',
    searchProducts: 'Поиск товаров',
    allCategories: 'Все категории',
    openCatalog: 'Открыть каталог',
    browseAllProducts: 'Просмотреть все товары',
    productsCount: (count: number) => {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'товаров';
      }

      if (lastDigit === 1) {
        return 'товар';
      }

      if (lastDigit >= 2 && lastDigit <= 4) {
        return 'товара';
      }

      return 'товаров';
    },
    enterAddress: 'Введите адрес',
    addressNotSpecified: 'Адрес не указан',
    exploreCategory: "Перейти в категорию",
    heroDescription: "Мы предлагаем широкий ассортимент качественных товаров по оптовым ценам. Свежие продукты, быстрая доставка и надежный сервис для вашего бизнеса.",
    wholesaleSupplies: "Оптовые поставки",
    food: "Продукты питания",
    householdGoods: "Хозтовары",
    toys: "Игрушки",
    groceries: "Бакалея",
    cannedGoods: "Консервы",
    beverages: "Напитки",
    price: "Цена",
    priceAsc: "Цена: по возрастанию",
    priceDesc: "Цена: по убыванию",
    newest: "Новинки",
    rating: "Рейтинг",
    brand: "Бренд",
    volume: "Объем",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    description: "Описание",
    specifications: "Характеристики",
    relatedProducts: "Похожие товары",
    addedToCart: "Добавлено в корзину",
    removedFromCart: "Удалено из корзины",
    emptyCart: "Корзина пуста",
    emptyCartDescription: "Добавьте товары в корзину, и они появятся здесь",
    geolocationNotSupported: "Геолокация не поддерживается вашим браузером",
    geolocationError: "Ошибка получения местоположения",
    geolocationPermissionDenied: "Доступ к местоположению запрещен",
    geolocationUnavailable: "Информация о местоположении недоступна",
    geolocationTimeout: "Время запроса местоположения истекло",
    allowGeolocation: "Разрешить доступ к местоположению",
    allowGeolocationDescription: "Это поможет нам показать ближайшие магазины и варианты доставки",
    allow: "Разрешить",
    viewOrder: "Посмотреть заказ",
    newContract: "Новый договор",
    createNewContract: "Создать  договор",
    enterCompanyName: "Введите название компании",
    companyCreated: "Компания успешно создана",
    failedToCreateCompany: "Не удалось создать компанию",
    // Auth related
    login: "Войти",
    enterPhoneNumber: "Введите номер телефона",
    enterSmsCode: "Введите код из SMS",
    phoneVerification: "Подтверждение телефона",
    sendCode: "Отправить код",
    verifyCode: "Подтвердить код",
    invalidPhoneNumber: "Неверный номер телефона",
    invalidCode: "Неверный код",
    unknownError: "Произошла ошибка. Пожалуйста, попробуйте снова",
    sending: "Отправка...",
    verifying: "Проверка...",
    resendCodeIn: "Отправить код повторно через {{seconds}} сек.",
    // Profile menu
    settings: "Настройки",
    personalInfo: "Личная информация",
    profileName: "Имя",
    profileEmail: "Email",
    profilePhone: "Телефон",
    dateOfBirth: "Дата рождения",
    cancel: "Отмена",
    saveProfile: "Сохранить",
    guest: "Гость",
    // Profile translations
    profileSettings: "Настройки профиля",
    updateProfile: "Обновить профиль",
    profileUpdated: "Профиль успешно обновлен",
    profileUpdateError: "Не удалось обновить профиль",
    loadingProfile: "Загрузка профиля...",
    updating: "Обновление...",
    // Contracts translations
    created: "Создан",
    updated: "Обновлен",
    noContracts: "Договоры не найдены",
    loadingContracts: "Загрузка договоров...",
    failedToLoadContracts: "Не удалось загрузить договоры",
    unknown: "Неизвестно",
    status_pending: "В ожидании",
    status_active: "Активный",
    status_inactive: "Неактивный",
    status_dissolution: "Процесс расторжения",
    status_dissolved: "Расторгнут",
    cartpg: {
      title: "Корзина",
      empty: "Корзина пуста",
      addItems: "Добавьте товары в корзину",
      continueShopping: "Продолжить покупки",
      total: "Итого",
      clear: "Очистить корзину",
      checkout: "Оформить заказ",
      quantity: "Количество",
      processing: "Обработка...",
      remove: "Удалить из корзины",
      itemAdded: "Товар добавлен в корзину",
      itemRemoved: "Товар удален из корзины",
      cartCleared: "Корзина очищена",
      promoCode: "Промокод",
      applyPromoCode: "Применить",
      enterPromoCode: "Введите промокод",
      promoCodeApplied: "Промокод применен",
      promoCodeInvalid: "Недействительный промокод",
      promoCodeDiscount: "Скидка",
      removePromoCode: "Удалить",
    },
    checkoutpg: {
      title: "Оформление заказа",
      orderInfo: "Информация о заказе",
      recipientName: "Имя получателя",
      enterRecipientName: "Введите имя получателя",
      orderComment: "Комментарий к заказу",
      enterOrderComment: "Введите дополнительную информацию о заказе",
      deliveryAddress: "Адрес доставки",
      noAddressSelected: "Адрес не выбран",
      selectAddress: "Выбрать адрес",
      changeAddress: "Изменить адрес",
      paymentMethod: "Способ оплаты",
      creditCard: "Банковская карта",
      cash: "Наличные",
      deliveryMethod: "Способ доставки",
      courier: "Доставка курьером",
      pickup: "Самовывоз",
      orderSummary: "Ваш заказ",
      subtotal: "Подытог",
      total: "Итого к оплате",
      deliveryCost: "Стоимость доставки",
      freeDelivery: "Бесплатная доставка",
      deliveryFrom: "от",
      placeOrder: "Оформить заказ",
      processing: "Обработка заказа...",
      fillAllFields: "Пожалуйста, заполните все обязательные поля",
      success: {
        title: "Заказ успешно оформлен",
        message: "Спасибо за заказ! Мы свяжемся с вами в ближайшее время.",
        orderNumber: "Номер заказа",
        backToHome: "Вернуться на главную"
      },
      promoCode: "Промокод",
      applyPromoCode: "Применить",
      enterPromoCode: "Введите промокод",
      promoCodeApplied: "Промокод применен",
      promoCodeInvalid: "Недействительный промокод",
      promoCodeDiscount: "Скидка",
      removePromoCode: "Удалить",
    },
    noProductsFound: "Товары не найдены",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: number | TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = useCallback((key: string, params?: number | TranslationParams): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    for (const k of keys) {
      if (typeof value === 'object' && !Array.isArray(value) && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value === 'function') {
      return typeof params === 'number' ? value(params) : key;
    }

    if (typeof value === 'string') {
      if (typeof params === 'object') {
        return Object.entries(params).reduce(
          (str, [param, val]) => str.replace(`{${param}}`, String(val)),
          value
        );
      }
      return value;
    }

    console.warn(`Invalid translation value for key: ${key}`);
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
