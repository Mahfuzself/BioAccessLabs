import{Page} from '@playwright/test'
export class LoginPage{
  constructor(private page : Page){
    
  }
  loginBtn = "//button[normalize-space(text())='Log In']"
//   private usernameInput = '#username';
//   private passwordInput = '#password';
//   private loginButton = '#loginBtn';

//   async login(username: string, password: string) {
//     await this.page.fill(this.usernameInput, username);
//     await this.page.fill(this.passwordInput, password);
//     await this.page.click(this.loginButton);
//     await this.page.waitForLoadState('networkidle');
//   }
}