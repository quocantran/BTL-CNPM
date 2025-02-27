"use client";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "@/hooks/debounce.select";
import { createUser, fetchRoles, updateUser } from "@/config/api";
import { useEffect, useState } from "react";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: IUser | null;
  setDataInit: (v: IUser | null) => void;

  reload: boolean;

  setReload: (v: boolean) => void;
}

export interface ICompanySelect {
  label: string;
  value: string;
  key?: string;
}

const UserModal = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit, reload, setReload } =
    props;

  const [form] = Form.useForm();

  const [companies, setCompanies] = useState<ICompanySelect[]>([]);
  const [roles, setRoles] = useState<ICompanySelect[]>([]);

  async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
    const res = await fetchRoles();

    if (res && res.metadata) {
      const list = res.metadata.result;
      const data = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      return data;
    } else return [];
  }

  const handleSubmit = async (valuesForm: any) => {
    const { name, email, password, address, age, gender, role, company } =
      valuesForm;
    if (dataInit?._id) {
      //update
      const user = {
        _id: dataInit._id,
        name,
        email,
        role: role?.value,
      };

      const res = await updateUser(user._id, user);

      if (res) {
        message.success("Cập nhật user thành công");
        setOpenModal(false);
        setDataInit(null);
        setReload(!reload);
      }
    } else {
      //create
      const user = {
        name,
        email,
        password,
        role: role.value,
      };

      const res = await createUser(user);
      if (res.metadata) {
        message.success("Thêm mới user thành công");
        setOpenModal(false);
        setDataInit(null);
        setReload(!reload);
      }
    }
  };

  return (
    <ModalForm
      title={dataInit?._id ? "Cập nhật người dùng" : "Tạo mới người dùng"}
      open={openModal}
      modalProps={{
        onCancel: () => {
          setOpenModal(false);
          setDataInit(null);
        },

        destroyOnClose: true,

        keyboard: false,
        maskClosable: false,
        okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
        cancelText: "Hủy",
      }}
      initialValues={dataInit?._id ? dataInit : {}}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng không bỏ trống" },
              { type: "email", message: "Vui lòng nhập email hợp lệ" },
            ]}
            placeholder="Nhập email"
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText.Password
            label="Password"
            name="password"
            disabled={dataInit?._id ? true : false}
            rules={[
              {
                required: !dataInit?._id ? true : false,
                message: "Vui lòng không bỏ trống",
              },
            ]}
            placeholder="Nhập password"
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText
            label="Tên hiển thị"
            name="name"
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            placeholder="Nhập tên hiển thị"
          />
        </Col>

        <Col lg={12} md={12} sm={24} xs={24}>
          <ProForm.Item
            name="role"
            label="Vai trò"
            rules={[
              {
                required: !dataInit?._id && true,
                message: "Vui lòng chọn vai trò!",
              },
            ]}
          >
            <DebounceSelect
              allowClear
              showSearch
              defaultValue={dataInit?.role?.name}
              value={roles}
              placeholder="Chọn vai trò"
              fetchOptions={fetchRoleList}
              onChange={(newValue: any) => {
                if (newValue?.length === 0 || newValue?.length === 1) {
                  setRoles(newValue as ICompanySelect[]);
                }
              }}
              style={{ width: "100%" }}
            />
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UserModal;
