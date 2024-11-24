import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { PublicClientApplication } from "@azure/msal-browser";
import Cookies from "js-cookie";
import { config } from "./Config";
import { signIn } from "./resources/user";
import Routes from "./routes";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isAuthenticated: false,
      user: {},
      msalInitialized: false,
    };

    this.publicClientApplication = new PublicClientApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
        authority: config.authority,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    });
  }

  async componentDidMount() {
    try {
      await this.publicClientApplication.initialize();
      this.setState({ msalInitialized: true });

      const accounts = this.publicClientApplication.getAllAccounts();
      if (accounts.length === 0) {
        this.login();
      } else {
        this.setState({
          isAuthenticated: true,
          user: accounts[0],
          error: null,
        });
      }
    } catch (error) {
      console.error("MSAL initialization error:", error);
      this.setState({ error: "Failed to initialize MSAL. Please try again." });
    }
  }

  async login() {
    if (!this.state.msalInitialized) return;

    try {
      const secret = process.env.REACT_APP_SECRET_TOKEN;
      const loginResponse = await this.publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });

      sessionStorage.setItem("user", JSON.stringify(loginResponse.account));
      this.setState({
        isAuthenticated: true,
        user: loginResponse.account,
        error: null,
      });

      const response = await signIn({
        user: loginResponse.account.name,
        token: secret,
      });

      Cookies.set("token", response.data.token);
      window.location = "/homeapp";
    } catch (error) {
      this.setState({
        isAuthenticated: false,
        user: {},
        error: error.message || "Login failed. Please try again.",
      });
      toast.error(error.response?.data?.message || "Falha no login.");
    }
  }

  logout() {
    if (this.state.msalInitialized) {
      this.publicClientApplication.logout();
      this.setState({ isAuthenticated: false, user: {}, error: null });
    }
  }

  render() {
    return (
      <div className="App">
        <Routes />
        <ToastContainer limit={1} autoClose={1000} position="top-left" />
      </div>
    );
  }

  renderError() {
    return <p className="error">{this.state.error}</p>;
  }
}

export default App;
