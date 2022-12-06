/*
Vault

SPDX-License-Identifier: CC0-1.0
*/

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./IERC721Holder.sol";

/**
 * @title Vault
 *
 * @notice this contract implements an example "holder" for the proposed
 * held token ERC standard.

 * This example vault contract allows a user to lock up an ERC721 token for
 * a specified period of time, while still reporting the functional owner
 */
contract Escrow is ERC165, IERC721Holder {
    using EnumerableSet for EnumerableSet.AddressSet;

    // members
    //IERC721 public token;
    uint256 public timelock;
    mapping(uint256 => address) public owners;
    mapping(uint256 => uint256) public locks;
    mapping(address => uint256) public balances;

    mapping(address => uint256) public tokens;

    EnumerableSet.AddressSet internal featuresSet;

    /**
     * // token_ address of token to be stored in vault
     * timelock_ duration in seconds that tokens will be locked
     */
    constructor() //address[] tokens /* uint256 timelock_ */
    {
        //token = IERC721(token_);
        //timelock = timelock_;
        /* for (uint256 i = 0; i < tokens.length; i++) {
            featuresSet.add(tokens[i]);
        } */
    }

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC721Holder).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IERC721Holder
     */
    function heldOwnerOf(address tokenAddress, uint256 tokenId) external view override returns (address) {
        //require(tokenAddress == address(token), "ERC721Vault: invalid token address");
        return owners[tokenId];
    }

    /**
     * @inheritdoc IERC721Holder
     */
    function heldBalanceOf(address tokenAddress, address owner) external view override returns (uint256) {
        //require(tokenAddress == address(token), "ERC721Vault: invalid token address");
        //this has to be change to take in account the set of token addresses
        return balances[owner];
    }

    /**
     * @notice deposit and lock a token for a period of time
     * @param tokenId ID of token to deposit
     */
    function deposit(
        address token,
        uint256 tokenId,
        uint256 timelock
    ) public {
        //verify if token is there

        require(msg.sender == IERC721(token).ownerOf(tokenId), "ERC721Vault: sender does not own token");

        owners[tokenId] = msg.sender;
        locks[tokenId] = block.timestamp + timelock;
        balances[msg.sender]++;

        emit Hold(msg.sender, address(token), tokenId);

        IERC721(token).transferFrom(msg.sender, address(this), tokenId);
    }

    /**
     * @notice withdraw token after timelock has elapsed
     * @param tokenId ID of token to withdraw
     */
    function withdraw(address token, uint256 tokenId) public {
        //check if token is in stored
        require(msg.sender == owners[tokenId], "ERC721Vault: sender does not own token");
        require(block.timestamp > locks[tokenId], "ERC721Vault: token is locked");

        delete owners[tokenId];
        delete locks[tokenId];
        balances[msg.sender]--;

        emit Release(msg.sender, token, tokenId);

        IERC721(token).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function updateTime(uint256 tokenId, uint256 newTime) public {
        //require sender = features
    }

    function addFeature(address feature) public {
        featuresSet.add(feature);
    }
}
