import { Controller, Body, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { InitTransactionDTO } from './orders.dto';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	initTransaction(@Body() body: InitTransactionDTO) {
		console.log(body);
		return this.ordersService.initTransaction(body);
	}

	@Post()
	executeTransaction() {
		this.ordersService.executeTransaction({} as any);
	}
}
