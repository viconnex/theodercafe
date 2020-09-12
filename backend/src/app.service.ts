import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
    getHello(): string {
        console.log('salut le monde')
        return 'bachibouzouk'
    }
}
