"use client";

import Loading from "@/components/Loading";
import VerifyOTP from "@/components/verifyOTP";
import { Suspense } from "react";



const VerifyPage = () => {
 
  return (
    <Suspense fallback={<Loading/>}>
      <VerifyOTP/>
    </Suspense>
  );
};

export default VerifyPage;
