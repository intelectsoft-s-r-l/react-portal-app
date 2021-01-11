import store from "./redux/store";

test("Check if there is CompanyID prop in account", () => {
  expect(store.getState().account).toHaveProperty("CompanyID");
});

test("Check if CompanyID is null by default", () => {
  const data = store.getState().account;
  expect(data).toMatchObject({ CompanyID: null });
});
