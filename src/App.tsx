import { useStocks } from "./hooks/useStocks";

function App() {
  const { data, isLoading } = useStocks();
  console.log(data, isLoading);

  return (
    <div>App</div>
  )
}

export default App;
