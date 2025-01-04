import { AG_GRID_LOCALE_EN } from "./aggrid-local.zh";

export const AG_GRID_LOCALE_INTERNATIONALIZATION: Record<string, string> = {};

// Create a dummy locale based on english but prefix everything with zzz
Object.keys(AG_GRID_LOCALE_EN).forEach(function (key) {
  if (key === 'thousandSeparator' || key === 'decimalSeparator') {
    return;
  }
  AG_GRID_LOCALE_INTERNATIONALIZATION[key] = AG_GRID_LOCALE_EN[key];
});
