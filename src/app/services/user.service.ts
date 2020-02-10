import { Injectable } from "@angular/core";
import { StorageService } from "./storage/storage.service";
export interface IUser {
  username: string;
  password: string;
  role: string;
  topics: Array<string>;
  questions: Array<string>;
  sessionToken: string;
}
@Injectable({
  providedIn: "root"
})
export class UserService {
  private masterToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpc2hhYmhrYWxyYTk2IiwiZW1haWwiOiJyaXNoYWJoa2FscmE5NkBnbWFpbC5jb20iLCJpYXQiOjE1ODA4ODI1Nzl9.dxrWrjX3jaUe4t33Y9H0oLdSxenSaJA-EYaCNHIk8Ys";
  private userlist = [
    {
      username: "12345",
      password: "12345",
      role: "vrp",
      topics: [
        "Water Harvesting",
        "Crop Cultivation",
        "Crop Production",
        "Livestock"
      ],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    },
    {
      username: "23456",
      password: "23456",
      role: "vrp",
      topics: ["Water Harvesting", "Crop Production"],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    },
    {
      username: "34567",
      password: "34567",
      role: "mrp",
      topics: ["Water Harvesting", "Crop Cultivation", "Agriculture Policies"],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    },
    {
      username: "45678",
      password: "45678",
      role: "mrp",
      topics: ["Crop Cultivation", "Soil Erosion", "Livestock"],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    },
    {
      username: "56789",
      password: "56789",
      role: "block_officer",
      topics: ["Crop Production", "Pesticide Control", "Crop Cultivation"],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    },
    {
      username: "67890",
      password: "67890",
      role: "block_officer",
      topics: [
        "Pesticide Control",
        "Agriculture Policies",
        "Crop Harvesting",
        "Dairy Farming"
      ],
      questions: [
        "What needs to be improved in the video.",
        "What do you want to learn more.",
        "What are the challenges in general."
      ],
      sessiontoken: ""
    }
  ];
  users: any;

  constructor(private storageService: StorageService) {}

  async validateUserDetails(username, password) {
    const users = await this.getUserList();
    if (!!users && !!users.length) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username === username.trim() && user.password === password) {
          const userdetails = { ...user };
          userdetails["sessiontoken"] = this.getMasterToken();
          this.setLoggedInUser(userdetails);
          return 1;
        } else if (user.username === username.trim()) {
          return 0;
        }
        return -1;
      }
    }
  }

  async getUserTopics() {
    const userDetails = await this.getLoggedInUser();
    return userDetails["topics"];
  }

  async getUserQuestions() {
    const userDetails = await this.getLoggedInUser();
    return userDetails["questions"];
  }

  async setLoggedInUser(userdetails) {
    const loggedinuser = await this.storageService.setObject(
      "loggedinuser",
      userdetails
    );
    return loggedinuser;
  }

  async getLoggedInUser() {
    const loggedinuser = await this.storageService.getObject("loggedinuser");
    if (loggedinuser) {
      return true;
    } else {
      return false;
    }
  }

  async getMasterToken() {
    const mastertoken = await this.storageService.get("mastertoken");
    return mastertoken;
  }

  endSession() {
    this.storageService.remove("loggedinuser");
  }

  async getUserList() {
    // return { ...this.userlist };
    this.users = await this.storageService.getObject("users");
    if (!!this.users) {
      return this.users;
    } else {
      const status = this.setUserList();
      if (status) {
        this.users = await this.storageService.getObject("users");
        return this.users;
      } else {
        return null;
      }
    }
  }

  async setUserList() {
    const validateUserCreation = await this.storageService.setObject(
      "users",
      this.userlist
    );
    const validateTokenCreation = await this.storageService.set(
      "mastertoken",
      this.masterToken
    );
    if (validateUserCreation && validateTokenCreation) return true;
    else return false;
  }

  clearUserList() {
    this.storageService.remove("users");
  }
}
