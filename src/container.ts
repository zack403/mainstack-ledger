import { container, Lifecycle } from 'tsyringe';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TOKENS } from './types/app.types';
import { AccountRepository } from './repositories/account.repository';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';

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
container.register(
  TOKENS.TransactionRepository,
  { useClass: TransactionRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.TransactionService,
  { useClass: TransactionService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  TOKENS.TransactionController,
  { useClass: TransactionController },
  { lifecycle: Lifecycle.Singleton }
);

export default container;
