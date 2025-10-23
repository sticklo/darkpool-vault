// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// Interface for ERC20 tokens (USDC)
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

/**
 * @title DarkPoolVault
 * @notice A transparent, social DCA vault for Base
 * @dev v0 - Hackathon MVP - Basic deposit functionality with manual DCA execution
 * 
 * IMPORTANT v0 LIMITATIONS (To be fixed in v1):
 * - No user withdrawals (deposit-only for demo)
 * - No SafeERC20 (works with standard USDC)
 * - Owner has emergency withdraw (testnet only - will add timelock in v1)
 * - Simple sorting algorithm (fine for <100 users, will optimize in v1)
 * - Manual DCA execution (will automate with Chainlink in v1)
 */
contract DarkPoolVault {
    
    // State variables
    IERC20 public usdcToken;
    address public owner;
    uint256 public totalDeposited;
    uint256 public totalUsers;
    
    // User data
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userDepositCount;
    mapping(address => bool) public hasDeposited;
    address[] public depositors;
    
    // Events
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event DCAExecuted(uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    /**
     * @notice Constructor - sets up the vault
     * @param _usdcAddress The USDC token contract address on Base Sepolia
     */
    constructor(address _usdcAddress) {
        owner = msg.sender;
        usdcToken = IERC20(_usdcAddress);
        totalDeposited = 0;
        totalUsers = 0;
    }
    
    /**
     * @notice Deposit USDC into the vault
     * @param _amount Amount of USDC to deposit (in 6 decimals - USDC uses 6 decimals)
     */
    function deposit(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from user to vault
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "USDC transfer failed"
        );
        
        // Update user data
        if (!hasDeposited[msg.sender]) {
            hasDeposited[msg.sender] = true;
            depositors.push(msg.sender);
            totalUsers++;
        }
        
        userDeposits[msg.sender] += _amount;
        userDepositCount[msg.sender]++;
        totalDeposited += _amount;
        
        emit Deposit(msg.sender, _amount, block.timestamp);
    }
    
    /**
     * @notice Get vault statistics
     * @return total Total USDC in vault
     * @return users Total number of users
     * @return balance Current USDC balance
     */
    function getVaultStats() external view returns (
        uint256 total,
        uint256 users,
        uint256 balance
    ) {
        return (
            totalDeposited,
            totalUsers,
            usdcToken.balanceOf(address(this))
        );
    }
    
    /**
     * @notice Get user statistics
     * @param _user User address
     * @return deposited Total amount deposited by user
     * @return count Number of deposits made
     */
    function getUserStats(address _user) external view returns (
        uint256 deposited,
        uint256 count
    ) {
        return (
            userDeposits[_user],
            userDepositCount[_user]
        );
    }
    
    /**
     * @notice Get top depositors (leaderboard)
     * @param _limit Number of top depositors to return
     * @return addresses Array of top depositor addresses
     * @return amounts Array of their deposit amounts
     */
    function getTopDepositors(uint256 _limit) external view returns (
        address[] memory addresses,
        uint256[] memory amounts
    ) {
        uint256 limit = _limit > depositors.length ? depositors.length : _limit;
        
        addresses = new address[](limit);
        amounts = new uint256[](limit);
        
        // Simple bubble sort for top depositors (fine for small arrays)
        address[] memory sortedAddresses = new address[](depositors.length);
        uint256[] memory sortedAmounts = new uint256[](depositors.length);
        
        for (uint256 i = 0; i < depositors.length; i++) {
            sortedAddresses[i] = depositors[i];
            sortedAmounts[i] = userDeposits[depositors[i]];
        }
        
        // Sort descending
        for (uint256 i = 0; i < depositors.length; i++) {
            for (uint256 j = i + 1; j < depositors.length; j++) {
                if (sortedAmounts[i] < sortedAmounts[j]) {
                    // Swap amounts
                    uint256 tempAmount = sortedAmounts[i];
                    sortedAmounts[i] = sortedAmounts[j];
                    sortedAmounts[j] = tempAmount;
                    
                    // Swap addresses
                    address tempAddress = sortedAddresses[i];
                    sortedAddresses[i] = sortedAddresses[j];
                    sortedAddresses[j] = tempAddress;
                }
            }
        }
        
        // Return top limit
        for (uint256 i = 0; i < limit; i++) {
            addresses[i] = sortedAddresses[i];
            amounts[i] = sortedAmounts[i];
        }
        
        return (addresses, amounts);
    }
    
    /**
     * @notice Manual DCA execution (for demo purposes)
     * @dev In v1, this will be automated with Chainlink/Gelato
     * @param _amount Amount to use for DCA swap
     */
    function executeDCA(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            usdcToken.balanceOf(address(this)) >= _amount,
            "Insufficient vault balance"
        );
        
        // For v0, we just emit an event
        // In v1, this will integrate with DEX to swap USDC -> BTC/ETH
        emit DCAExecuted(_amount, block.timestamp);
        
        // NOTE: Actual swap logic will be added in v1
    }
    
    /**
     * @notice Emergency withdrawal (only owner)
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(
            usdcToken.balanceOf(address(this)) >= _amount,
            "Insufficient balance"
        );
        
        require(
            usdcToken.transfer(owner, _amount),
            "Transfer failed"
        );
        
        emit Withdrawal(owner, _amount, block.timestamp);
    }
    
    /**
     * @notice Get all depositors
     * @return Array of depositor addresses
     */
    function getAllDepositors() external view returns (address[] memory) {
        return depositors;
    }
    
    /**
     * @notice Get contract version
     * @return Version string
     */
    function version() external pure returns (string memory) {
        return "DarkPool v0.1 - Hackathon MVP";
    }
}