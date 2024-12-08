import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import CoinIcon from '../../images/goldencoin.png';

const DropdownCoin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coins, setCoins] = useState(0); // Initialize with 0
  const [transactions, setTransactions] = useState([]);

  // Fetch coin balance and transactions from the server
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/coins', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }

        const data = await response.json();
        setCoins(data.coins);
        setTransactions(data.transactions || []); // Set transactions if available
      } catch (error) {
        console.error('Error fetching coin data:', error.message);
      }
    };

    fetchCoinData();
  }, []);

  // Format date to "DD MMM, hh:mm A"
  const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  };

  const renderTransactionHistory = () => {
    if (transactions.length === 0) {
      return (
        <li className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          No transactions available
        </li>
      );
    }

    return transactions.map((transaction, index) => (
      <li
        key={index}
        className="flex justify-between items-center px-4 py-2 text-sm text-black dark:text-white"
      >
        <span>{transaction.message}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(transaction.createdAt)}
        </span>
      </li>
    ));
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => setDropdownOpen(!dropdownOpen)}
          to="#"
          className="relative flex items-center gap-3 px-3 py-2 rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white transform transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-primary dark:hover:shadow-strokedark"
        >
          {/* Coin icon with hover pop effect */}
          <img
            src={CoinIcon}
            alt="Coins"
            className="h-5 w-5 transform transition-transform duration-300 ease-in-out hover:scale-125"
          />

          {/* Coin count text */}
          <span className="block text-sm font-medium text-black dark:text-white">
            {coins} Coins
          </span>
        </Link>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2.5 w-80 flex flex-col rounded-lg border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark neumorphism">
            {/* Title for Transaction History */}
            <div className="px-6 py-3 text-lg font-semibold text-black dark:text-white border-b border-stroke dark:border-strokedark">
              Transaction History
            </div>

            <ul className="flex flex-col gap-2 px-6 py-4">
              {/* Transaction History */}
              {renderTransactionHistory()}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownCoin;
