
const React = require('react');
const Router = require('react-router-dom');
const Route = Router.Route;
const Switch = Router.Switch;
import IndexPage from './routes/IndexPage'
import Index from './routes/Index/Index'
import Personalcenter from './routes/personalCenter/Personalcenter'
import PersonalInfo from './routes/personalInfo/PersonalInfo'
import Login from './routes/auth/Login'
import AddCar from './routes/addCar/AddCar'
import SelectCarInfo from './routes/addCar/SelectCarBrand'
import CarBrand from './routes/addCar/CarBrand'

import OrderTrack from './routes/order/OrderTrack'
import ServiceCard from './routes/service/ServiceCard'
import OrderDetail from './routes/orderDetail/orderDetail'
import OrderDetail_nopay from './routes/orderDetail/orderDetail_nopay'
import OrderDetail_vip from './routes/orderDetail/orderDetail_vip'
import AddCard from './routes/addCard/addCard'

import MyCardDetail from './routes/membership/MyCardDetail'
import MyCard from './routes/membership/MyCard'
import MyPoints from './routes/membership/MyPoints'

//智能柜用户端
import Scancode from './routes/scancode/Scancode'
import Chooseid from './routes/chooseId/Chooseid'
import PersonalInfo2 from './routes/personalInfo2/PersonalInfo2'
import OrderBilling from './routes/billing/OrderBilling'
import CabinetOpened from './routes/cabinetOpened/CabinetOpened'
import CabinetDoneOpenUser from './routes/cabinetOpened/CabinetDoneOpenUser'
import ReservationSuccess from './routes/reservation/ReservationSuccess';
import MyReservation from './routes/reservation/MyReservation'; 
import PayOrder from './routes/billing/PayOrder'; 
import CabinetOrderTrack from './routes/billing/CabinetOrderTrack'; 

//智能柜技师端
import ReservationNotification from './routes/technician/ReservationNotification'; 
import CabinetDoneOpen from './routes/technician/CabinetDoneOpen'
import CabinetServeOpen from './routes/technician/CabinetServeOpen'
import StaffLogin from './routes/technician/StaffLogin'
import ServeDoneBeforeOpen from './routes/technician/ServeDoneBeforeOpen'
import TechCabinet from './routes/technician/TechCabinet'
import Serving from './routes/technician/Serving'
import Dialog from './routes/technician/Dailog'

// //车险询价
import Inquiry from './routes/autoInsurance/Inquiry'

//爱车信息
import CarInfo from './routes/carInfo/CarInfo'

//保险信息
import Insurance from './routes/insuranceInfo/Insurance'

//门店 
import CooperativeStore from './routes/store/CooperativeStore'
import StoreDetail from './routes/store/StoreDetail'
import CommentStore from './routes/store/CommentStore'
import MyFavour from './routes/store/MyFavour'
import FavourDetail from './routes/store/FavourDetail'
import NotFound from './routes/NotFound'
//活动
import ReceiveCoupons from './routes/activity/ReceiveCoupons'
import Activity from './routes/activity/Activity.js'

//weui page


//结果页面
import Result from './routes/weui/Result'


const App = () => (
    <div style={{height:'100%'}}>
        <Switch>
            <Route exact path="/" component={CooperativeStore}/>
            <Route path="/activity/:openid/:nickname/:headimgurl"  component={Activity} />
            <Route path="/receivecoupons" component={ReceiveCoupons}/>
            <Route path="/center"  component={Personalcenter} />
            <Route path="/login"  component={Login} />
            <Route path="/indexPage" component={Index} />
            <Route path="/addcar/:select" component={AddCar} />
            <Route path="/carbrand" component={CarBrand} />
            <Route path="/ordertrack" component={OrderTrack} />
            <Route path="/personalInfo" component={PersonalInfo} />
            <Route path="/serviceCard" component={ServiceCard} />
            <Route path="/orderDetail" component={OrderDetail} />
            <Route path="/orderDetail_nopay" component={OrderDetail_nopay} />
            <Route path="/orderDetail_vip" component={OrderDetail_vip} />
            <Route path="/addCard" component={AddCard} />
            <Route path="/membership/mycard" exact component={MyCard} />
            <Route path="/membership/mycard/detail/:id" exact component={MyCardDetail}/>
            <Route path="/membership/mypoints" exact component={MyPoints}/>
            <Route path="/membership/myfavour" exact component={MyFavour}/>
            <Route path="/favourdetail" exact component={FavourDetail}/>
            <Route path="/carInfo" component={CarInfo}/>
            <Route path="/store" exact component={CooperativeStore}/>
            <Route path="/store/comment/:consumerOrderId" exact component={CommentStore}/>
            <Route path="/insurance/:carId" exact component={Insurance}/>

            <Route path="/notFound" component={NotFound}/>
            <Route path="/inquiry" exact component={Inquiry}/>
         
            <Route path="/store-detail"  component={StoreDetail}/>
            <Route path="/result" exact component={Result}/>
            <Route path="/scancode" exact component={Scancode}/>
            <Route path="/chooseId" exact component={Chooseid}/>
            <Route path="/personalInfo2" exact component={PersonalInfo2}/>
            <Route path="/orderBilling" exact component={OrderBilling}/>
            <Route path="/cabinetOpened" exact component={CabinetOpened}/>
            <Route path="/cabinetDoneOpenUser" exact component={CabinetDoneOpenUser}/>

            <Route path="/cabinetDoneOpen" exact component={CabinetDoneOpen}/>
            <Route path="/cabinetServeOpen" exact component={CabinetServeOpen}/>

            <Route path="/serving" exact component={Serving}/>
            <Route path="/stafflogin" exact component={StaffLogin}/>
            <Route path="/serveDoneBeforeOpen" exact component={ServeDoneBeforeOpen}/>

            <Route path="/reservationSuccess" exact component={ReservationSuccess}/>
            <Route path="/myReservation" exact component={MyReservation}/>
            <Route path="/payOrder" exact component={PayOrder}/>
            <Route path="/cabinetOrderTrack" exact component={CabinetOrderTrack}/>

            <Route path="/reservationNotification" exact component={ReservationNotification}/>
            <Route path="/techCabinet" exact component={TechCabinet}/>
            <Route path="/dialog" exact component={Dialog}/>
            <Route component={NotFound}/>
        </Switch>
    </div>
);

module.exports = App;