package kr.or.ddit.vo;

import java.util.Date;

import lombok.Data;

//자바빈 클래스
//1) 멤버변수(프로퍼티) 2) 기본생성자 3) getter/setter메소드
//@Data=> PoJo(Plain순수한 old Java object)에 위배
@Data
public class BookVO {
	private int rnum; // 행번호
	private int bookId;
	private String title;
	private String category;
	private int price;
	private Date insertDate;
	
	/*
	public BookVO() {
		
	}

	@Override
	public String toString() {
		return "BookVO [bookId=" + bookId + ", title=" + title + ", category=" + category + ", price=" + price
				+ ", insertDate=" + insertDate + "]";
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}
	
	*/
}
