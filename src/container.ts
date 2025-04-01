import { container, Lifecycle } from 'tsyringe';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TOKENS } from './types/auth.type';

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

export default container;
