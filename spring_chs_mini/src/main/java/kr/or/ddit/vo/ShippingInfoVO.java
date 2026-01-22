package kr.or.ddit.vo;

import java.util.Date;

import lombok.Data;

@Data
public class ShippingInfoVO {
   private int    shippingInfoId;
   private String cartId;
   private String name;
   private Date   shippingDate;
   private String zipCode;
   private String addressName;
   private String addressDetName;
}