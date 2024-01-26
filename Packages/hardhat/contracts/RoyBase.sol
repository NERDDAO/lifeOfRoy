// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract RoyBase is ERC1155PresetMinterPauser {
	uint256 public constant ROYS = 0;

	constructor()
		ERC1155PresetMinterPauser("https://game.example/api/item/{id}.json")
	{
		_mint(msg.sender, ROYS, 10000 ** 18, "");
	}
}
