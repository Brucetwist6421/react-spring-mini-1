package kr.or.ddit.util.unsupervisedLearning;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

//자바빈 클래스 : 프로퍼티 + 기본생성자 + getter/setter메서드
// 데이터 포인트를 나타내는 클래스 (여기서는 2차원)
public class ClusterDataPoint {
	int studentId;
    double x;
    double y;
    int clusterId; // 이 데이터 포인트가 속한 군집 ID (초기에는 -1 또는 미지정)
    // 실습 2 시작
    String studentName;

    
    public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	// 실습 2 끝
    public ClusterDataPoint(double x, double y) {
        this.x = x;
        this.y = y;
        this.clusterId = -1; // 초기에는 어떤 군집에도 속하지 않음
    }

    public ClusterDataPoint(int studentId, double colx, double coly) {
    	this.studentId = studentId;
    	 this.x = colx;
         this.y = coly;
         this.clusterId = -1; // 초기에는 어떤 군집에도 속하지 않음
    }
    

	public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getClusterId() {
        return clusterId;
    }

    public void setClusterId(int clusterId) {
        this.clusterId = clusterId;
    }

	public int getStudentId() {
		return studentId;
	}

	public void setStudentId(int studentId) {
		this.studentId = studentId;
	}

	@Override
	public String toString() {
		return "ClusterDataPoint [studentId=" + studentId + ", x=" + x + ", y=" + y + ", clusterId=" + clusterId + "]";
	}

    
}
