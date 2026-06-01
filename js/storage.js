const STORAGE_KEY = "financial_app_data";
const SETTINGS_KEY = "app_settings";
const BUDGETS_KEY = "category_budgets";

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getSettings() {
  const defaults = {
    theme: 'dark',
    userName: 'Asep',
    currency: 'IDR'
  };
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...defaults, ...JSON.parse(data) } : defaults;
}

function saveBudgets(budgets) {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

function getBudgets() {
  const data = localStorage.getItem(BUDGETS_KEY);
  return data ? JSON.parse(data) : {};
}
