// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts@5.0.1/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@5.0.1/access/Ownable.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@5.0.1/token/ERC1155/extensions/ERC1155Supply.sol";
import { SchemaResolver } from "./eas-contracts/contracts/resolver/SchemaResolver.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

import { IEAS, Attestation } from "../eas-contracts/contracts/IEAS.sol";

contract Roy is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply, SchemaResolver {
    address payable public Owner;
    error InvalidValue();

    constructor(IEAS eas) ERC1155("") Ownable(msg.sender) SchemaResolver(eas) {
        Owner = payable(msg.sender);
    }

    function onAttest(
		Attestation calldata attestation,
		uint256 value
	) internal override returns (bool) {
		if (
            value > 0
		) {
            _mint(attestation.attester, 1, 1, "");
			return true;
		}
		return false;
	}
    function isPayable() public pure override returns (bool) {
        return true;
    }

	function onRevoke(
		Attestation calldata /*attestation*/,
		uint256 /*value*/
	) internal pure override returns (bool) {
		return true;
	}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function withdraw () public onlyOwner { 
        Owner.transfer(address(this).balance);
    }
}
