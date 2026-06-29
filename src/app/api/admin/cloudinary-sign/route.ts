import { auth } from "@/auth";
import {
  getCloudinaryConfig,
  getCloudinaryUploadFolder,
  getConfiguredCloudinary,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

type SignableValue = string | number | boolean;

function getSignableParams(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const params: Record<string, SignableValue> = {};

  for (const [key, paramValue] of Object.entries(value)) {
    if (
      key === "signature" ||
      key === "api_key" ||
      key === "resource_type" ||
      paramValue === null ||
      paramValue === undefined
    ) {
      continue;
    }

    if (
      typeof paramValue === "string" ||
      typeof paramValue === "number" ||
      typeof paramValue === "boolean"
    ) {
      params[key] = paramValue;
    }
  }

  return params;
}

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const paramsToSign = getSignableParams(body?.paramsToSign);
  const folder = getCloudinaryUploadFolder();

  if (!paramsToSign) {
    return Response.json({ error: "Invalid signature payload" }, { status: 400 });
  }

  if (paramsToSign.folder !== folder) {
    return Response.json({ error: "Invalid upload folder" }, { status: 400 });
  }

  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig();
  const signature = getConfiguredCloudinary().utils.api_sign_request(
    paramsToSign,
    apiSecret
  );

  return Response.json({
    signature,
    apiKey,
    cloudName,
    folder,
  });
}
