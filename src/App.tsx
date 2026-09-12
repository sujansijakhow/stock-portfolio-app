import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { useStocks } from "./hooks/useStocks";

function App() {
  const { data, isLoading } = useStocks();
  console.log(data, isLoading);

  const dispatch = useAppDispatch()
  const holdings = useAppSelector((state) => state.portfolio.holdings)
  console.log(holdings)


  return (
    <div>App</div>
  )
}

export default App;
