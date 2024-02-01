// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { SchemaResolver } from "../eas-contracts/contracts/resolver/SchemaResolver.sol";

import { IEAS, Attestation } from "../eas-contracts/contracts/IEAS.sol";

/// @title TokenResolver
/// @notice A sample schema resolver that checks whether a specific amount of tokens was approved to be included in an attestation.
contract RoyBase is ERC1155PresetMinterPauser, SchemaResolver {
	using SafeERC20 for IERC20;

	error InvalidAllowance();

	IERC20 private immutable _targetToken;
	uint256 private immutable _targetAmount;
	uint256 public constant ROYS = 0;

	constructor(
		IEAS eas,
		IERC20 targetToken,
		uint256 targetAmount
	)
		SchemaResolver(eas)
		ERC1155PresetMinterPauser("https://game.example/api/item/{id}.json")
	{
		_targetToken = targetToken;
		_targetAmount = targetAmount;

		_mint(msg.sender, ROYS, 10000 ** 18, "");
	}

	function onAttest(
		Attestation calldata attestation,
		uint256 /*value*/
	) internal view override returns (bool) {
		if (
			_targetToken.allowance(attestation.attester, address(this)) <
			_targetAmount
		) {
			revert InvalidAllowance();
		}

		return true;
	}

	function onRevoke(
		Attestation calldata /*attestation*/,
		uint256 /*value*/
	) internal pure override returns (bool) {
		return true;
	}
}
