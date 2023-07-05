import AccountDetailHeader from "@components/AccountDetailHeader";
import Container from "@components/Container";
import Loading from "@components/Loading";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ContentBox } from "~/app/components/ContentBox";
import MnemonicInputs from "~/app/components/mnemonic/MnemonicInputs";
import SecretKeyDescription from "~/app/components/mnemonic/SecretKeyDescription";
import api, { GetAccountRes } from "~/common/lib/api";

function BackupSecretKey() {
  const { t } = useTranslation("translation", {
    keyPrefix: "accounts.account_view.mnemonic",
  });

  const [mnemonic, setMnemonic] = useState<string | undefined>();
  const [account, setAccount] = useState<GetAccountRes>();
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const account = await api.getAccount(id);
      setAccount(account);

      const accountMnemonic = await api.getMnemonic(id as string);
      setMnemonic(accountMnemonic);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return loading ? (
    <div className="flex justify-center mt-5">
      <Loading />
    </div>
  ) : (
    <div>
      {account && <AccountDetailHeader account={account} />}
      <Container>
        <ContentBox>
          <h1 className="font-bold text-2xl dark:text-white">
            {t("backup.title")}
          </h1>
          {mnemonic ? (
            <>
              <SecretKeyDescription />
              <MnemonicInputs mnemonic={mnemonic} readOnly />
            </>
          ) : (
            <p>{t("backup.no_mnemonic_found")}</p>
          )}
        </ContentBox>
      </Container>
    </div>
  );
}

export default BackupSecretKey;
