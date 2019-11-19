import React, {useEffect} from 'react';
import './public/style/app.scss';
import Header from "./components/Header";
import NestRoutes from "./router/NestRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import {fetchChannelBar} from "./redux/actions";
import {useDispatch} from "redux-react-hook";
import {Helmet} from "react-helmet";

function App() {
  let dispatch = useDispatch();
  // 获取导航栏的数据
  useEffect(()=> {
    dispatch(fetchChannelBar())
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Helmet>
          <title>高仿哔哩哔哩-( ゜- ゜)つロ干杯~ - bilbili</title>
        </Helmet>
        <Header/>
        <div className={'content-container'}>
          <NestRoutes/>
        </div>
      </div>
    </Router>
  );
}

export default App;
