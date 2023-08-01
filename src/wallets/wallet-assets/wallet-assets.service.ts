import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';

@Injectable()
export class WalletAssetsService {
	constructor(private prismaService: PrismaService) {}

	all(filter: { wallet_id: string }) {
		return this.prismaService.walletAssets.findMany({
			where: {
				wallet_id: filter.wallet_id,
			},
			include: {
				Asset: {
					select: {
						id: true,
						price: true,
						symbol: true,
					},
				},
			},
		});
	}

	create(input: { wallet_id: string; asset_id: string; shares: number }) {
		const { wallet_id, asset_id, shares } = input;
		return this.prismaService.walletAssets.create({
			data: {
				wallet_id: wallet_id,
				asset_id: asset_id,
				shares: shares,
			},
		});
	}
}
