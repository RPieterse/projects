import moment from "moment/moment";

export default {
  users: [
    {
      id: "1",
      fName: "John",
      lName: "Carrey",
      email: "john@carrey.com",
      status: "completed",
      createdAt: new Date('01/03/2020').getTime()
    },
    {
      id: "2",
      fName: "Peter",
      lName: "Parker",
      email: "parker@peter.com",
      status: "inprogress",
      createdAt: new Date('08/03/2020').getTime()
    },
    {
      id: "3",
      fName: "Hannah",
      lName: "Smith",
      email: "hannah@smith.com",
      status: "completed",
      createdAt: new Date('01/04/2020').getTime()
    },
    {
      id: "4",
      fName: "Mary",
      lName: "Jane",
      email: "mary@carrey.com",
      status: "cancelled",
      createdAt: new Date('01/12/2021').getTime()
    },
  ],
};
