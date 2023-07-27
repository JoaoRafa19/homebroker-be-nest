import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WalletAssetsService } from './wallet-assets.service';

//Nested endPoints
// /wallets
//
@Controller('wallets/:wallet_id/assets')
export class WalletAssetsController {
	constructor(private walletAssetService: WalletAssetsService) {}

	@Get()
	all(@Param('wallet_id') wallet_id: string) {
		console.log('wallet_id ', wallet_id);
		return this.walletAssetService.all({ wallet_id });
	}

	@Post()
	create(
		@Param('wallet_id') wallet_id: string,
		@Body() body: { asset_id: string; shares: number },
	) {
		return this.walletAssetService.create({ wallet_id, ...body });
	}
}
