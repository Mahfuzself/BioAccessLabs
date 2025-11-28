import { test, expect } from '../../src/fixtures/baseTest';
test("Login is working properly",async({page})=>{
    await page.goto('/')
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email Address:' }).click();
    await page.getByRole('textbox', { name: 'Email Address:' }).fill('mahfuz@yopmail.com');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('Test@1234');
    await page.getByRole('link', { name: 'Login' }).click();

})