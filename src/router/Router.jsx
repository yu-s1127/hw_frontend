import { BrowserRouter, Route } from 'react-router-dom';
import HandWritten from '../components/HandWritten';

const Router = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={HandWritten}></Route>
    </BrowserRouter>
  );
};

export default Router;
