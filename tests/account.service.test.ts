import { TOKENS } from '../src/types/app.types';
import { AccountRepository } from '../src/repositories/account.repository';
import sinon from 'sinon';
import { IAccountService } from '../src/types/account.type';
import container from '../src/container';
import { Currency } from '../src/enums';

describe('AccountService', () => {
  let accountService: IAccountService;
  let accountRepoStub: sinon.SinonStubbedInstance<AccountRepository>;

  beforeEach(() => {
    accountRepoStub = sinon.createStubInstance(AccountRepository); // Use class
    accountRepoStub.findByUserId.resolves([
      {
        accountId: 'acc-test',
        userId: 'usr-test',
        balance: '0.00',
        currency: Currency.NGN,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ]);
    accountRepoStub.update.resolves({
      accountId: 'acc-test',
      balance: '0.00',
      currency: Currency.USD,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    container.register(TOKENS.AccountRepository, { useValue: accountRepoStub });
    accountService = container.resolve(TOKENS.AccountService);
  });

  afterEach(() => {
    sinon.restore();
    container.clearInstances();
  });

  it('should update account currency', async () => {
    const req = {
      context: { userId: 'usr-test', requestId: 'test-req' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const dto = { currency: 'USD' };
    const result = await accountService.updateAccount(req, dto);

    expect(result.accountId).toBe('acc-test');
    expect(result.currency).toBe('USD');
    expect(
      accountRepoStub.update.calledOnceWith('acc-test', { currency: 'USD' })
    ).toBe(true);
  });

  it('should retrieve account details', async () => {
    const req = {
      context: { userId: 'usr-test', requestId: 'test-req' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const result = await accountService.getAccount(req);

    expect(result.accountId).toBe('acc-test');
    expect(result.balance).toBe('0.00');
    expect(result.currency).toBe('NGN');
    expect(accountRepoStub.findByUserId.calledOnceWith('usr-test')).toBe(true);
  });
});
