import * as fs from "fs";

export interface IUser {
  id?: number;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}
interface IUserUn extends Partial<IUser> {}

export default class User {
  static addUser(data: IUser) {
    const users: { users: IUser[] } = JSON.parse(
      fs.readFileSync("src/lib/db.json", "utf-8")
    );

    users.users.push(data);
    fs.writeFileSync("src/lib/db.json", JSON.stringify(users));
    return data;
  }
  static findAll(fn: (val: IUser, index: number) => void) {
    const users: { users: IUser[] } = JSON.parse(
      fs.readFileSync("src/lib/db.json", "utf-8")
    );
    return users.users.filter(fn);
  }
  static findUser(data: IUserUn) {
    const users: { users: IUser[] } = JSON.parse(
      fs.readFileSync("src/lib/db.json", "utf-8")
    );
    if (!data.email && !data.fullName && !data.password && !data.id) {
      return false;
    }
    const findedUser = users.users.findIndex((val) =>
      (data.password ? val.password == data.password : true) &&
      (data.fullName ? val.fullName == data.fullName : true) &&
      (data.email ? val.email == data.email : true) &&
      (data.id ? val.id == data.id : true)
        ? true
        : false
    );

    return users.users[findedUser];
  }
  static updateUser(id: number, data: IUserUn) {
    const users: { users: IUser[] } = JSON.parse(
      fs.readFileSync("src/lib/db.json", "utf-8")
    );
    const findedUser = users.users.findIndex((val) =>
      (id ? val.id == id : true) &&
      (data.password ? val.password == data.password : true) &&
      (data.fullName ? val.fullName == data.fullName : true) &&
      (data.email ? val.email == data.email : true) &&
      (data.id ? val.id == data.id : true)
        ? true
        : false
    );

    const user = {
      ...users.users[findedUser],
      ...data,
    };
    users.users = [
      ...users.users.slice(0, findedUser),
      ...users.users.slice(findedUser + 1, users.users.length),
    ];
    users.users.push(user);
    fs.writeFileSync("src/lib/db.json", JSON.stringify(users));
    return user;
  }
  static removeUser(data: IUser) {
    const users: { users: IUser[] } = JSON.parse(
      fs.readFileSync("src/lib/db.json", "utf-8")
    );
    const findedUser = users.users.findIndex((val) =>
      val.password == data.password && val.fullName == data.fullName
        ? true
        : false
    );
    users.users.slice(findedUser, 1);
    fs.writeFileSync("src/lib/db.json", JSON.stringify(users));
    return true;
  }
}
