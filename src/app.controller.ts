import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';

const users = [
  { username: 'zesen', password: '111111', email: 'xxx@xxx.com' },
  { username: 'zesen1', password: '222222', email: 'yyy@yyy.com' },
];
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() userDto: UserDto) {
    const user = users.find((item) => item.username === userDto.username);

    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== userDto.password) {
      throw new BadRequestException('密码错误');
    }

    const accessToken = this.jwtService.sign(
      {
        username: user.username,
        email: user.email,
      },
      {
        expiresIn: '0.5h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        username: user.username,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      userInfo: {
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  @Get('aaa')
  aaa(@Req() req: Request) {
    const auth = req.headers['authorization'];

    if (!auth) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = auth.split(' ')[1];
      const data = this.jwtService.verify(token);

      console.log(data);
    } catch (e) {
      throw new UnauthorizedException('token失效, 请重新登录');
    }
  }

  @Get('refresh')
  refresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token);

      const user = users.find((item) => item.username === data.username);

      const accessToken = this.jwtService.sign(
        {
          username: user.username,
          email: user.email,
        },
        {
          expiresIn: '0.5h',
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          username: user.username,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('token失效, 请重新登录');
    }
  }
}
