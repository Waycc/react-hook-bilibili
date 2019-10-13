import React, {useEffect} from 'react';
import './public/style/app.scss';
import Header from "./components/Header";
import NestRoutes from "./router/NestRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import {fetchChannelBar} from "./redux/actions";
import {useDispatch} from "redux-react-hook";

function App() {
  let dispatch = useDispatch();
  // 获取导航栏的数据
  useEffect(()=> {
    dispatch(fetchChannelBar())
  }, [dispatch]);

  return (
    <Router>
      <div style={{ backgroundColor: '#f4f4f4' }}>
        <Header/>
        <NestRoutes/>
      </div>
    </Router>
  );
}

export default App;
