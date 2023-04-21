import axios from 'axios';
import util from 'util';

const cl = (obj) => {
  console.log(
    util.inspect(obj, {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );
};
const domain = 'https://wms-api-beta.sta.kolonfnc.com';
const token =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqaWh3YW4ua2ltIiwiYXV0aCI6IlJPTEVfREVWIiwiZXhwIjoxNjgxOTAyMzk3fQ.k1Z_-YQ3HJhBJP4VDE_r-g5BVpG_-0eXb5_gITrpQDiIuOX2LFOX-qsL3_4FXOQ_Hk9nq8DqTDCp6eXVVKc2CA';
const headers = {
  'Content-type': 'application/json',
  Authorization: `Bearer ${token}`,
};
const cjClientNumber = '30405302';
const getPackingTarget = async () => {
  const result = await axios
    .post(
      `${domain}/api/front/adm/wo/packing-target`,
      {
        fromDate: '2023-04-19',
        toDate: '2023-04-19',
        workIds: ['34'],
        equipmentSeqIn: [],
        omsOrderPackingType: 'MULTI',
        brandCodes: [],
      },
      { headers }
    )
    .then((res) => res.data);
  return result;
};
const getMultiPackingGoods = async (packingId) => {
  const result = await axios
    .post(
      `${domain}/api/front/adm/wo/multi-packing-goods`,
      {
        packingId,
        workDate: '2023-04-19',
        workId: '34',
      },
      {
        headers,
      }
    )
    .then((res) => res.data);
  return result;
};
const getPackingIdsSet = (packingTarget) => [
  ...new Set(
    packingTarget.outPackingTargetDTOs
      .filter((item) => item.completeQuantity === 0)
      .map((item) => item.packingId)
  ),
];
const getOrderCompleteParam = ({
  multiPackingGoods,
  invoiceNumber,
  packingId,
}) => ({
  courierCode: 'C01',
  inUpdateCompleteOrderBoxDTOs: [
    {
      inUpdateCompleteOrderProductDTOs:
        multiPackingGoods.outMultiPackingGoodsDTOs.map((item) => ({
          productCode: item.productCode,
          quantity: item.quantity,
        })),
      invoiceNumber,
    },
  ],
  optionalSingelPackOrderId: '',
  optionalSinglePackRfidTag: '',
  packingId,
  workDate: '2023-04-19',
  workId: '34',
});
const getInvoiceNumber = async () => {
  const result = await axios
    .post(
      `${domain}/api/front/adm/wo/invoice-number/${cjClientNumber}`,
      {},
      { headers }
    )
    .then((res) => res.data.invoiceNumber);
  return result;
};
const orderComplete = (param) => {
  axios
    .post(`${domain}/api/front/adm/wo/order-complete`, param, { headers })
    .then((res) => {
      const consoleObj = {
        message: res.data.message,
        packingId: param.packingId,
      };
      cl(consoleObj);
    });
};
const main = async () => {
  const packingTarget = await getPackingTarget();
  const packingIdsSet = getPackingIdsSet(packingTarget);
  cl(packingIdsSet);
  packingIdsSet.forEach(async (pid) => {
    console.log(pid);
    const multiPackingGoods = await getMultiPackingGoods(pid);
    const invoiceNumber = await getInvoiceNumber();
    const orderCompleteParam = getOrderCompleteParam({
      multiPackingGoods,
      invoiceNumber,
      packingId: pid,
    });
    orderComplete(orderCompleteParam);
  });
};
main();
