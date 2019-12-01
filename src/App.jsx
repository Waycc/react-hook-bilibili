import React, {useEffect} from 'react';
import './public/style/app.scss';
import Header from "./components/Header";
import NestRoutes from "./router/NestRoutes";
import {BrowserRouter as Router, withRouter} from "react-router-dom";
import {fetchChannelBar} from "./redux/actions";
import {useDispatch} from "redux-react-hook";
import {Helmet} from "react-helmet";
import {NO_HEADER_PAGE} from "./util/constants";

function App(props) {
  let { location } = props
  let dispatch = useDispatch();
  // 获取导航栏的数据
  useEffect(() => {
    dispatch(fetchChannelBar())
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('popstate', (e) => {
      console.log(e, 'popstate')
    })
  })

  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      console.log(e, 'popstate')
    })
  })

  return (
    <div>
      <Helmet>
        <title>高仿哔哩哔哩-( ゜- ゜)つロ干杯~ - bilbili</title>
      </Helmet>
      {
        !NO_HEADER_PAGE.includes(location.pathname) &&
        <Header/>
      }
      <div className={'content-container'}>
        <NestRoutes/>
      </div>
    </div>
  );
}

export default withRouter(App);
