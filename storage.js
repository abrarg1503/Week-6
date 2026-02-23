export function savePreferences(city) {
    localStorage.setItem("weatherCity", city);
}

export function loadPreferences() {
    return localStorage.getItem("weatherCity") || "London";
}
