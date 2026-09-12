import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { useStocks } from "./hooks/useStocks";
import { ChartsPage } from "./pages/ChartPages";

function App() {
  const { data, isLoading } = useStocks();
  console.log(data, isLoading);

  const dispatch = useAppDispatch()
  const holdings = useAppSelector((state) => state.portfolio.holdings)
  console.log(holdings)


  return (
    <div>
      <ChartsPage />
    </div>
  )
}

export default App;
