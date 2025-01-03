let map;
let markers = {}; // 儲存標記
const carLocations = {}; // 儲存車號位置

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
}

// 提交車輛位置
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;

    const password = prompt("請輸入密碼，系統測試中348362");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法提交車輛位置。");
        return;
    }

    const locations = {
        "二級廠": { lat: 24.8953731, lng: 121.2110354, range: 'B6' },
        "OK鋼棚": { lat: 24.8955410, lng: 121.2094455, range: 'B7' },
        "連側鋼棚": { lat: 24.8955352, lng: 121.2088128, range: 'B8' },
        "無線電鋼棚": { lat: 24.8942494, lng: 121.2084913, range: 'B9' },
        "陸區鋼棚": { lat: 24.8936913, lng: 121.2085201, range: 'B10' },
        "玄捷鋼棚": { lat: 24.8933285, lng: 121.2084722, range: 'B11' },
        "風雨走廊": { lat: 24.8926953, lng: 121.2099437, range: 'B12' },
        "待安置車號": { lat: 24.8950000, lng: 121.2090000, range: 'B13' }
    };

    const carLocation = locations[location];
    if (!carLocation) {
        alert("指定位置無效。");
        return;
    }

    // 在地圖上添加標記
    addMarker(carLocation.lat, carLocation.lng, carNumber);

    // 儲存車號及其位置
    carLocations[carNumber] = {
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng
    };

    // 儲存車號到試算表對應的範圍
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('locastatus');
    const range = sheet.getRange(carLocation.range);  // 定位範圍
    range.setValue(carNumber);  // 設置車號

    updateStatusTable();
}

// 添加標記
function addMarker(lat, lng, title) {
    if (markers[title]) {
        markers[title].setMap(null);
    }

    markers[title] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title
    });
}

// 更新狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = ""; // 清空表格內容

    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];

        const row = document.createElement("tr");

        // 顯示位置名稱
        const locationCell = document.createElement("td");
        locationCell.textContent = carInfo.locationName;
        row.appendChild(locationCell);

        // 顯示車號
        const carNumberCell = document.createElement("td");
        carNumberCell.textContent = carNumber;
        row.appendChild(carNumberCell);

        // 顯示總數
        const totalCell = document.createElement("td");
        totalCell.textContent = Object.keys(carLocations).length;
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
}

// 清除所有車號
function clearCarNumbers() {
    Object.values(markers).forEach(marker => marker.setMap(null)); // 移除所有標記
    markers = {}; // 清空標記
    for (const key in carLocations) {
        delete carLocations[key]; // 清空車號資料
    }
    updateStatusTable(); // 更新狀況表
}
