import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { InitTransactionDTO, InputExecuteTransactionDTO } from './orders.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
	constructor(private prismaService: PrismaService) {}

	initTransaction(input: InitTransactionDTO) {
		return this.prismaService.order.create({
			data: {
				asset_id: input.asset_id,
				wallet_id: input.wallet_id,
				shares: input.shares,
				type: input.type,
				status: OrderStatus.PENDING,
				price: input.price,
				partial: input.shares,
			},
		});
	}

	async executeTransaction(input: InputExecuteTransactionDTO) {
		this.prismaService.$transaction(async (prisma: PrismaService) => {
			const order = await prisma.order.findUniqueOrThrow({
				where: { id: input.order_id },
			});

			// adicionar a transação em order
			await prisma.order.update({
				where: {
					id: input.order_id,
				},
				data: {
					status: input.status,
					partial: order.partial - input.negotiated_shared,
					Transactions: {
						create: {
							broker_transaction_id: input.broker_transaction_id,
							related_investor_id: input.related_investor,
							shares: input.shares,
							price: input.price,
						},
					},
				},
			});
			await this.updateWalletAssets(input, order, prisma);
		});

		// atualizar o status da ordem OPEN ou CLOSE

		// atualizar o preço do ativo
	}

	/**
	 * Updade WalletAssets and change the asset shares in wallet
	 * */
	private async updateWalletAssets(
		input: InputExecuteTransactionDTO,
		order,
		prisma: PrismaService,
	) {
		if (input.status == OrderStatus.CLOSED) {
			await prisma.asset.update({
				where: { id: order.asset_id },
				data: {
					price: input.price,
				},
			});

			const wallet_asset = await prisma.walletAssets.findUnique({
				where: {
					wallet_id_asset_id: {
						asset_id: order.asset_id,
						wallet_id: order.wallet_id,
					},
				},
			});

			if (wallet_asset) {
				prisma.walletAssets.update({
					where: {
						wallet_id_asset_id: {
							wallet_id: order.wallet_id,
							asset_id: order.asset_id,
						},
					},
					data: {
						shares: wallet_asset.shares + input.negotiated_shared,
					},
				});
			} else {
				// somente se a ordem for de compra
				await prisma.walletAssets.create({
					data: {
						asset_id: order.asset_id,
						wallet_id: order.wallet_id,
						shares: input.negotiated_shared,
					},
				});
			}
		}
	}
}
