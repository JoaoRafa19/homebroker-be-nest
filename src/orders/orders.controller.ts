import { Controller, Body, Post, Param, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { InitTransactionDTO, InputExecuteTransactionDTO } from './orders.dto';

@Controller('wallets/:wallet_id/orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Get()
	all(@Param('wallet_id') wallet_id: string) {
		return this.ordersService.all({ wallet_id });
	}

	@Post()
	initTransaction(
		@Param('wallet_id') wallet_id: string,
		@Body() body: Omit<InitTransactionDTO, 'wallet_id'>,
	) {
		console.log(body);
		return this.ordersService.initTransaction({ ...body, wallet_id });
	}

	@Post('/execute')
	executeTransaction(@Body() body: InputExecuteTransactionDTO) {
		console.log(body);
		return this.ordersService.executeTransaction(body);
	}
}
