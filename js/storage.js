const STORAGE_KEY = "financial_app_data";

function saveToStorage(data){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}

function getFromStorage(){

  return JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];

}