"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function PopMessage() {
  const message = useSearchParams().get("succMsg");

  useEffect(() => {
    if (message) toast.success(message);
  }, [])


  return (
    <></>
  );
}