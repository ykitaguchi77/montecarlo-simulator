import React, { useState } from 'react';

const generateInitialSequence = (initialInvestment) => {
  const base = Math.floor(initialInvestment / 4);
  return [base, base * 2, base * 3];
};

const baccaratMonteCarlo = (initialInvestment, initialBalance, maxRounds) => {
  let initialSequence = generateInitialSequence(initialInvestment);
  let sequence = [...initialSequence];
  let balance = initialBalance;

  for (let i = 0; i < maxRounds; i++) {
    if (balance <= 0) break;

    if (sequence.length === 0) {
      sequence = [...initialSequence];
    }

    let bet = sequence[0] + sequence[sequence.length - 1];
    if (bet > balance) bet = balance;

    balance -= bet;

    if (Math.random() < 0.5) { // Win
      balance += bet * 2;
      if (sequence.length > 1) {
        sequence = sequence.slice(1, -1);
      } else {
        sequence = [];
      }
    } else { // Lose
      sequence.push(bet);
    }
  }

  return balance;
};

const runSimulation = (initialInvestment, initialBalance, maxRounds, numSimulations) => {
  let finalBalances = [];
  let bankruptcies = 0;
  let belowInitial = 0;
  let profitableBalances = [];

  for (let i = 0; i < numSimulations; i++) {
    const finalBalance = baccaratMonteCarlo(initialInvestment, initialBalance, maxRounds);
    finalBalances.push(finalBalance);

    if (finalBalance === 0) bankruptcies++;
    if (finalBalance < initialBalance) belowInitial++;
    if (finalBalance > initialBalance) profitableBalances.push(finalBalance);
  }

  const avgFinalBalance = finalBalances.reduce((a, b) => a + b, 0) / numSimulations;
  const bankruptcyRate = (bankruptcies / numSimulations) * 100;
  const belowInitialRate = (belowInitial / numSimulations) * 100;
  const profitRate = (profitableBalances.length / numSimulations) * 100;
  const avgProfitableBalance = profitableBalances.length > 0 
    ? profitableBalances.reduce((a, b) => a + b, 0) / profitableBalances.length 
    : 0;
  const maxProfitableBalance = Math.max(...profitableBalances, 0);
  const minFinalBalance = Math.min(...finalBalances);

  return {
    avgFinalBalance,
    bankruptcyRate,
    belowInitialRate,
    profitRate,
    avgProfitableBalance,
    maxProfitableBalance,
    minFinalBalance
  };
};

const BaccaratSimulator = () => {
  const [initialInvestment, setInitialInvestment] = useState('4000');
  const [initialBalance, setInitialBalance] = useState('60000');
  const [maxRounds, setMaxRounds] = useState('50');
  const [numSimulations, setNumSimulations] = useState('10000');
  const [results, setResults] = useState(null);

  const handleSimulation = () => {
    const simulationResults = runSimulation(
      Number(initialInvestment),
      Number(initialBalance),
      Number(maxRounds),
      Number(numSimulations)
    );
    setResults(simulationResults);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">バカラ・モンテカルロ法シミュレーター</h1>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">注意</p>
        <p>このシミュレーターは教育目的のみで使用してください。実際のギャンブルでの使用はお勧めしません。</p>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">パラメータ設定</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">初期投資額</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">初期残高</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">最大ラウンド数</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={maxRounds}
              onChange={(e) => setMaxRounds(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">シミュレーション回数</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={numSimulations}
              onChange={(e) => setNumSimulations(e.target.value)}
            />
          </div>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={handleSimulation}
        >
          シミュレーション実行
        </button>
      </div>

      {results && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">シミュレーション結果</h2>
          <ul className="list-disc pl-5">
            <li>平均最終残高: {results.avgFinalBalance.toFixed(2)}</li>
            <li>破産確率: {results.bankruptcyRate.toFixed(2)}%</li>
            <li>元金を下回る確率: {results.belowInitialRate.toFixed(2)}%</li>
            <li>利益を出せる確率: {results.profitRate.toFixed(2)}%</li>
            <li>利益が出た場合の平均最終額: {results.avgProfitableBalance.toFixed(2)}</li>
            <li>利益が出た場合の最高額: {results.maxProfitableBalance.toFixed(2)}</li>
            <li>最終の最低残高: {results.minFinalBalance.toFixed(2)}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BaccaratSimulator;