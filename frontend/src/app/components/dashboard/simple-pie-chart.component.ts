import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pie-chart-container">
      <div class="pie-chart">
        <div *ngFor="let slice of slices; let i = index" 
             class="pie-slice" 
             [style.background-color]="slice.color"
             [style.transform]="'rotate(' + slice.startAngle + 'deg)'"
             [style.clip-path]="'polygon(50% 50%, 50% 0%, ' + slice.endX + '% ' + slice.endY + '%)'">
        </div>
      </div>
      <div class="chart-legend">
        <div *ngFor="let slice of slices" class="legend-item">
          <div class="legend-color" [style.background-color]="slice.color"></div>
          <div class="legend-label">{{ slice.label }} ({{ slice.percentage }}%)</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pie-chart-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .pie-chart {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: #f0f0f0;
      overflow: hidden;
      margin-bottom: 20px;
    }
    
    .pie-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
    }
    
    .chart-legend {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    
    .legend-label {
      font-size: 14px;
      color: #555;
    }
  `]
})
export class SimplePieChartComponent implements OnChanges {
  @Input() data: { value: number, label: string, color: string }[] = [];
  
  slices: { 
    percentage: number, 
    startAngle: number, 
    color: string, 
    label: string,
    endX: number,
    endY: number
  }[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChart();
    }
  }
  
  updateChart(): void {
    const total = this.data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) {
      this.slices = [];
      return;
    }
    
    let currentAngle = 0;
    
    this.slices = this.data.map(item => {
      const percentage = Math.round((item.value / total) * 100);
      const startAngle = currentAngle;
      const angleInRadians = (percentage * 3.6) * Math.PI / 180;
      
      // Calculate the end point of the arc
      const endX = 50 + 50 * Math.sin(angleInRadians);
      const endY = 50 - 50 * Math.cos(angleInRadians);
      
      currentAngle += (percentage * 3.6); // 3.6 degrees per percentage point (360 / 100)
      
      return {
        percentage,
        startAngle,
        color: item.color,
        label: item.label,
        endX,
        endY
      };
    });
  }
}