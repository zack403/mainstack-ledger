import { container, Lifecycle } from 'tsyringe';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TOKENS } from './types/app.types';
import { AccountRepository } from './repositories/account.repository';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';

container.register(
  TOKENS.UserRepository,
  { useClass: UserRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.AuthService,
  { useClass: AuthService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.AuthController,
  { useClass: AuthController },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.AccountRepository,
  { useClass: AccountRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.AccountService,
  { useClass: AccountService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.AccountController,
  { useClass: AccountController },
  { lifecycle: Lifecycle.Singleton }
);

export default container;
