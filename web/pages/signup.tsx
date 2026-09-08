import { GetServerSidePropsContext } from "next";

export default function SignUp() {
  return null;
}

export const getServerSideProps = async (_context: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: "/secret-signup",
      permanent: false,
    },
  };
};
