import { ReactNode } from "react";
import Footer from "./footer";
import NavBarV2 from "./navbar/navBarV2";

interface BasePageV2Props {
  children: ReactNode;
}

const BasePageV2 = (props: BasePageV2Props) => {
  const { children } = props;

  return (
    <div className="bg-white">
      <NavBarV2 />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default BasePageV2;
