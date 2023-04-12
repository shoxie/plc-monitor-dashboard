import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
const NotificationContext = createContext({
  notis: [],
  addNoti: (title, content, type, actionText, action) => {},
});

export function NotificationProvider({ children }) {
  const [notis, setNotis] = useState([]);

  const addNoti = (title, content, type, actionText, action) => {
    const newItem = {
      title,
      content,
      id: Math.floor(Math.random() * 999).toString(),
      type,
      action,
      actionText,
    };
    const temp = [...notis, newItem];
    setNotis(temp);
    setTimeout(() => {
      action();
      setNotis((prev) => {
        const newArr = prev.filter((item, idx) => item !== newItem);
        return newArr;
      });
    }, 5000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notis,
        addNoti,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNoti() {
  const data = useContext(NotificationContext);

  if (!data) {
    throw new Error("Noti must be provided");
  }

  return data;
}
